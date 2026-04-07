package main

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"os"
	"path/filepath"
	"sort"
	"strings"
	"sync"
	"time"

	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-lambda-go/lambda"
)

const (
	maxScoreValue      = 1000000
	minScoreValue      = 0
	maxNameLength      = 20
	maxLeaderboardSize = 10
	rateLimitWindow    = 10 * time.Second
	maxRequestsPerIP   = 5
	maxBodySize        = 1024
)

type ScoreEntry struct {
	Name      string    `json:"name"`
	Score     int       `json:"score"`
	Timestamp time.Time `json:"timestamp"`
}

type Leaderboard struct {
	Scores []ScoreEntry `json:"scores"`
}

type RateLimitEntry struct {
	Requests []int64 `json:"requests"`
}

type SubmitRequest struct {
	Name  string `json:"name"`
	Score int    `json:"score"`
}

type BlobsContext struct {
	URL   string `json:"url"`
	Token string `json:"token"`
}

type Storage interface {
	Get(store, key string) ([]byte, error)
	Set(store, key string, data []byte) error
}

type BlobStorage struct {
	ctx *BlobsContext
}

type LocalStorage struct {
	dir string
	mu  sync.RWMutex
}

var localStorage *LocalStorage

func getStorage() (Storage, error) {
	ctx := os.Getenv("NETLIFY_BLOBS_CONTEXT")
	if ctx != "" {
		var blobsCtx BlobsContext
		if err := json.Unmarshal([]byte(ctx), &blobsCtx); err != nil {
			return nil, fmt.Errorf("failed to parse blobs context: %w", err)
		}
		return &BlobStorage{ctx: &blobsCtx}, nil
	}

	if localStorage == nil {
		dir := os.Getenv("LOCAL_STORAGE_DIR")
		if dir == "" {
			dir = "/tmp/leaderboard-data"
		}
		if err := os.MkdirAll(dir, 0755); err != nil {
			return nil, fmt.Errorf("failed to create local storage dir: %w", err)
		}
		localStorage = &LocalStorage{dir: dir}
	}
	return localStorage, nil
}

func (s *BlobStorage) Get(store, key string) ([]byte, error) {
	url := fmt.Sprintf("%s/%s/%s", s.ctx.URL, store, key)
	req, err := http.NewRequest("GET", url, nil)
	if err != nil {
		return nil, err
	}
	req.Header.Set("Authorization", "Bearer "+s.ctx.Token)

	resp, err := http.DefaultClient.Do(req)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	if resp.StatusCode == http.StatusNotFound {
		return nil, nil
	}
	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("blob get failed: %d", resp.StatusCode)
	}

	return io.ReadAll(resp.Body)
}

func (s *BlobStorage) Set(store, key string, data []byte) error {
	url := fmt.Sprintf("%s/%s/%s", s.ctx.URL, store, key)
	req, err := http.NewRequest("PUT", url, bytes.NewReader(data))
	if err != nil {
		return err
	}
	req.Header.Set("Authorization", "Bearer "+s.ctx.Token)
	req.Header.Set("Content-Type", "application/json")

	resp, err := http.DefaultClient.Do(req)
	if err != nil {
		return err
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK && resp.StatusCode != http.StatusCreated {
		return fmt.Errorf("blob set failed: %d", resp.StatusCode)
	}
	return nil
}

func (s *LocalStorage) Get(store, key string) ([]byte, error) {
	s.mu.RLock()
	defer s.mu.RUnlock()

	path := filepath.Join(s.dir, store+"_"+key+".json")
	data, err := os.ReadFile(path)
	if os.IsNotExist(err) {
		return nil, nil
	}
	return data, err
}

func (s *LocalStorage) Set(store, key string, data []byte) error {
	s.mu.Lock()
	defer s.mu.Unlock()

	path := filepath.Join(s.dir, store+"_"+key+".json")
	return os.WriteFile(path, data, 0644)
}

func checkRateLimit(storage Storage, ip string) (bool, error) {
	key := "ratelimit_" + strings.ReplaceAll(ip, ".", "_")
	data, err := storage.Get("leaderboard", key)
	if err != nil {
		return false, err
	}

	var entry RateLimitEntry
	if data != nil {
		if err := json.Unmarshal(data, &entry); err != nil {
			entry = RateLimitEntry{Requests: []int64{}}
		}
	}

	now := time.Now().Unix()
	windowStart := now - int64(rateLimitWindow.Seconds())

	var validRequests []int64
	for _, ts := range entry.Requests {
		if ts > windowStart {
			validRequests = append(validRequests, ts)
		}
	}

	if len(validRequests) >= maxRequestsPerIP {
		return false, nil
	}

	validRequests = append(validRequests, now)
	entry.Requests = validRequests

	newData, err := json.Marshal(entry)
	if err != nil {
		return false, err
	}

	if err := storage.Set("leaderboard", key, newData); err != nil {
		return false, err
	}

	return true, nil
}

func getLeaderboard(storage Storage) (*Leaderboard, error) {
	data, err := storage.Get("leaderboard", "scores")
	if err != nil {
		return nil, err
	}

	if data == nil {
		return &Leaderboard{Scores: []ScoreEntry{}}, nil
	}

	var lb Leaderboard
	if err := json.Unmarshal(data, &lb); err != nil {
		return &Leaderboard{Scores: []ScoreEntry{}}, nil
	}
	return &lb, nil
}

func saveLeaderboard(storage Storage, lb *Leaderboard) error {
	data, err := json.Marshal(lb)
	if err != nil {
		return err
	}
	return storage.Set("leaderboard", "scores", data)
}

func sanitizeName(name string) string {
	name = strings.TrimSpace(name)
	if len(name) > maxNameLength {
		name = name[:maxNameLength]
	}
	var clean strings.Builder
	for _, r := range name {
		if (r >= 'a' && r <= 'z') || (r >= 'A' && r <= 'Z') || 
		   (r >= '0' && r <= '9') || r == ' ' || r == '_' || r == '-' {
			clean.WriteRune(r)
		}
	}
	result := clean.String()
	if result == "" {
		result = "Anonymous"
	}
	return result
}

func corsHeaders() map[string]string {
	return map[string]string{
		"Access-Control-Allow-Origin":  "*",
		"Access-Control-Allow-Methods": "GET, POST, OPTIONS",
		"Access-Control-Allow-Headers": "Content-Type",
		"Content-Type":                 "application/json",
	}
}

func errorResponse(statusCode int, message string) events.APIGatewayProxyResponse {
	body, _ := json.Marshal(map[string]string{"error": message})
	return events.APIGatewayProxyResponse{
		StatusCode: statusCode,
		Headers:    corsHeaders(),
		Body:       string(body),
	}
}

func handler(ctx context.Context, request events.APIGatewayProxyRequest) (events.APIGatewayProxyResponse, error) {
	if request.HTTPMethod == "OPTIONS" {
		return events.APIGatewayProxyResponse{
			StatusCode: 200,
			Headers:    corsHeaders(),
		}, nil
	}

	storage, err := getStorage()
	if err != nil {
		return errorResponse(500, "Storage unavailable: "+err.Error()), nil
	}

	clientIP := request.Headers["x-forwarded-for"]
	if clientIP == "" {
		clientIP = request.RequestContext.Identity.SourceIP
	}
	if idx := strings.Index(clientIP, ","); idx > 0 {
		clientIP = strings.TrimSpace(clientIP[:idx])
	}

	switch request.HTTPMethod {
	case "GET":
		lb, err := getLeaderboard(storage)
		if err != nil {
			return errorResponse(500, "Failed to load leaderboard"), nil
		}

		body, _ := json.Marshal(lb.Scores)
		return events.APIGatewayProxyResponse{
			StatusCode: 200,
			Headers:    corsHeaders(),
			Body:       string(body),
		}, nil

	case "POST":
		if len(request.Body) > maxBodySize {
			return errorResponse(413, "Request too large"), nil
		}

		allowed, err := checkRateLimit(storage, clientIP)
		if err != nil {
			return errorResponse(500, "Rate limit check failed"), nil
		}
		if !allowed {
			return errorResponse(429, "Too many requests, please wait"), nil
		}

		var req SubmitRequest
		if err := json.Unmarshal([]byte(request.Body), &req); err != nil {
			return errorResponse(400, "Invalid request body"), nil
		}

		if req.Score < minScoreValue || req.Score > maxScoreValue {
			return errorResponse(400, "Invalid score"), nil
		}

		req.Name = sanitizeName(req.Name)

		lb, err := getLeaderboard(storage)
		if err != nil {
			return errorResponse(500, "Failed to load leaderboard"), nil
		}

		newEntry := ScoreEntry{
			Name:      req.Name,
			Score:     req.Score,
			Timestamp: time.Now(),
		}
		lb.Scores = append(lb.Scores, newEntry)

		sort.Slice(lb.Scores, func(i, j int) bool {
			return lb.Scores[i].Score > lb.Scores[j].Score
		})

		if len(lb.Scores) > maxLeaderboardSize {
			lb.Scores = lb.Scores[:maxLeaderboardSize]
		}

		if err := saveLeaderboard(storage, lb); err != nil {
			return errorResponse(500, "Failed to save score"), nil
		}

		rank := -1
		for i, entry := range lb.Scores {
			if entry.Name == newEntry.Name && entry.Score == newEntry.Score &&
				entry.Timestamp.Equal(newEntry.Timestamp) {
				rank = i + 1
				break
			}
		}

		response := map[string]interface{}{
			"success":     true,
			"rank":        rank,
			"leaderboard": lb.Scores,
		}
		body, _ := json.Marshal(response)
		return events.APIGatewayProxyResponse{
			StatusCode: 200,
			Headers:    corsHeaders(),
			Body:       string(body),
		}, nil

	default:
		return errorResponse(405, "Method not allowed"), nil
	}
}

func main() {
	lambda.Start(handler)
}
