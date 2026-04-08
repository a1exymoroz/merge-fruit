import { getStore } from "@netlify/blobs";
import type { Context } from "@netlify/functions";

const MAX_SCORE_VALUE = 1000000;
const MIN_SCORE_VALUE = 0;
const MAX_NAME_LENGTH = 20;
const MAX_LEADERBOARD_SIZE = 10;
const RATE_LIMIT_WINDOW = 10; // seconds
const MAX_REQUESTS_PER_IP = 5;
const MAX_BODY_SIZE = 1024;

interface ScoreEntry {
  name: string;
  score: number;
  timestamp: string;
}

interface RateLimitEntry {
  requests: number[];
}

interface SubmitRequest {
  name: string;
  score: number;
}

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
  "Content-Type": "application/json",
};

function sanitizeName(name: string): string {
  const trimmed = name.trim().slice(0, MAX_NAME_LENGTH);
  const clean = trimmed.replace(/[^a-zA-Z0-9 _-]/g, "");
  return clean || "Anonymous";
}

function errorResponse(status: number, message: string): Response {
  return new Response(JSON.stringify({ error: message }), {
    status,
    headers: corsHeaders,
  });
}

async function checkRateLimit(ip: string): Promise<boolean> {
  const store = getStore("leaderboard");
  const key = `ratelimit_${ip.replace(/[.:]/g, "_")}`;

  let entry: RateLimitEntry = { requests: [] };
  try {
    const data = await store.get(key, { type: "json" });
    if (data) {
      entry = data as RateLimitEntry;
    }
  } catch {
    // Key doesn't exist yet
  }

  const now = Math.floor(Date.now() / 1000);
  const windowStart = now - RATE_LIMIT_WINDOW;

  const validRequests = entry.requests.filter((ts) => ts > windowStart);

  if (validRequests.length >= MAX_REQUESTS_PER_IP) {
    return false;
  }

  validRequests.push(now);
  await store.setJSON(key, { requests: validRequests });

  return true;
}

async function getLeaderboard(): Promise<ScoreEntry[]> {
  const store = getStore("leaderboard");
  try {
    const data = await store.get("scores", { type: "json" });
    if (data && Array.isArray((data as any).scores)) {
      return (data as any).scores;
    }
  } catch {
    // Key doesn't exist yet
  }
  return [];
}

async function saveLeaderboard(scores: ScoreEntry[]): Promise<void> {
  const store = getStore("leaderboard");
  await store.setJSON("scores", { scores });
}

export default async (request: Request, context: Context): Promise<Response> => {
  if (request.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  const clientIP =
    context.ip ||
    request.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
    "unknown";

  if (request.method === "GET") {
    try {
      const scores = await getLeaderboard();
      return new Response(JSON.stringify(scores), {
        status: 200,
        headers: corsHeaders,
      });
    } catch (e) {
      return errorResponse(500, `Failed to load leaderboard: ${e}`);
    }
  }

  if (request.method === "POST") {
    const body = await request.text();
    if (body.length > MAX_BODY_SIZE) {
      return errorResponse(413, "Request too large");
    }

    try {
      const allowed = await checkRateLimit(clientIP);
      if (!allowed) {
        return errorResponse(429, "Too many requests, please wait");
      }
    } catch (e) {
      return errorResponse(500, `Rate limit check failed: ${e}`);
    }

    let data: SubmitRequest;
    try {
      data = JSON.parse(body);
    } catch {
      return errorResponse(400, "Invalid request body");
    }

    const score = data.score;
    if (
      typeof score !== "number" ||
      score < MIN_SCORE_VALUE ||
      score > MAX_SCORE_VALUE
    ) {
      return errorResponse(400, "Invalid score");
    }

    const name = sanitizeName(data.name || "");

    let scores: ScoreEntry[];
    try {
      scores = await getLeaderboard();
    } catch (e) {
      return errorResponse(500, `Failed to load leaderboard: ${e}`);
    }

    const newEntry: ScoreEntry = {
      name,
      score,
      timestamp: new Date().toISOString(),
    };

    scores.push(newEntry);
    scores.sort((a, b) => b.score - a.score);
    scores = scores.slice(0, MAX_LEADERBOARD_SIZE);

    try {
      await saveLeaderboard(scores);
    } catch (e) {
      return errorResponse(500, `Failed to save score: ${e}`);
    }

    let rank = -1;
    for (let i = 0; i < scores.length; i++) {
      if (
        scores[i].name === newEntry.name &&
        scores[i].score === newEntry.score &&
        scores[i].timestamp === newEntry.timestamp
      ) {
        rank = i + 1;
        break;
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        rank,
        leaderboard: scores,
      }),
      { status: 200, headers: corsHeaders }
    );
  }

  return errorResponse(405, "Method not allowed");
};
