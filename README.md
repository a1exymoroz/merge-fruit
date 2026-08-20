# 🍉 Merge Fruit

A physics-based fruit-merging puzzle game (2048-style "Suika Game" clone) built with React, TypeScript, and Matter.js. Drop fruits into a container, merge identical fruits to create bigger ones, and try to reach the Watermelon without stacking over the Game Over line. Play as a guest or sign up to save scores to an online leaderboard.

## 🎮 How to Play

1. **Drop Fruits**: Click the top area of the container to drop a randomly chosen fruit
2. **Merge Fruits**: When 2 identical fruits touch, they automatically merge into the next larger fruit in the sequence
3. **Chain Reactions**: Merged fruits can trigger additional merges if they touch more identical fruits
4. **Score Points**: Each merge gives you points based on the fruit type (larger fruits = more points)
5. **Game Over**: The game ends if any fruit stays above the Game Over line for 2 seconds

## 🍓 Fruit Progression

11 fruit types in a clear progression sequence, from Cherry (10 points) up to Watermelon (20,000 points). Initially only the first few smallest fruits are available to drop; larger ones unlock as you merge.

## 🎯 Features

- **Physics-based gameplay** — realistic gravity, collisions, rolling, and stacking via Matter.js
- **Auto merge & chain reactions** — cascading combos when identical fruits touch
- **Accounts & guest mode** — sign up / log in for a saved profile, or play instantly as a guest
- **Online leaderboard** — authenticated users can submit scores and see how they rank
- **Multi-language UI** — English, Polish, and Russian, via i18next
- **Email verification** — new accounts are verified by email before full access
- **Responsive design** — works on desktop and mobile
- **In-app tech stack page** — visit `/stack` (or the floating button) to see how the app is built

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm

### Installation

1. Install dependencies:

   ```bash
   npm install
   ```

2. Start the development server:

   ```bash
   npm run dev
   ```

3. Open your browser and navigate to the URL shown in the terminal (usually `http://localhost:5173`)

The frontend talks to a separate backend API (see [Tech Stack](#-tech-stack)) for auth, email verification, and the leaderboard; `VITE_API_BASE_URL` controls which API it points to. Copy `.env.development.example` to `.env.development` (and `.env.production.example` to `.env.production` for prod builds) and set the URL there — both `.env.*` files are gitignored since they're environment-specific, not secrets to commit. On Netlify, set `VITE_API_BASE_URL` in the site's environment variables instead of committing a `.env.production` file.

### Build for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## 🧪 Testing

The project includes end-to-end (e2e) tests using Playwright.

```bash
npm run test:e2e          # run all e2e tests
npm run test:e2e:ui       # interactive UI mode
npm run test:e2e:headed   # see the browser while tests run
npm run test:e2e:debug    # debug mode
```

Test coverage includes game initialization, fruit dropping/merging, scoring, game-over conditions, and high-score persistence. If running for the first time, install browsers with `npx playwright install`.

## 🛠️ Tech Stack

Frontend: React 18, TypeScript, Vite, Redux Toolkit, React Router, Matter.js (physics), i18next (i18n), Playwright (e2e). Backend: Spring Boot (Java), PostgreSQL, JWT auth. Deployed on Netlify (frontend) and Render + Neon (backend/DB).

For the full architecture, request flows, API endpoints, and directory map, see [docs/STACK.md](docs/STACK.md) — the same content is also rendered live in the app at `/stack`.

## 📝 License

This project is open source and available for personal use.

Enjoy playing! 🎮
