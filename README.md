# 🍎 Fruit Merge Game

A physics-based puzzle game built with React and Matter.js! Drop fruits into a container and merge identical fruits to create larger ones. The goal is to reach the Watermelon without letting fruits stack above the Game Over line!

## 🎮 How to Play

1. **Drop Fruits**: Click the top area of the container to drop a randomly chosen fruit
2. **Merge Fruits**: When 2 identical fruits touch, they automatically merge into the next larger fruit in the sequence
3. **Chain Reactions**: Merged fruits can trigger additional merges if they touch more identical fruits
4. **Score Points**: Each merge gives you points based on the fruit type (larger fruits = more points)
5. **Game Over**: The game ends if any fruit stays above the Game Over line for 2 seconds

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

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

### Build for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## 🎯 Features

- **Physics-Based**: Realistic 2D physics with collision detection, rolling, and stacking using Matter.js
- **Drop Mechanics**: Click to drop fruits from the top of the container
- **Auto Merge**: Automatic merging when 2 identical fruits touch
- **Chain Reactions**: Cascading merges create exciting combos
- **Score Tracking**: Real-time score display with high score persistence
- **Game Over Line**: Visible warning line - don't let fruits stack too high!
- **Responsive Design**: Works on desktop and mobile devices
- **Beautiful UI**: Modern gradient design with smooth animations

## 🍓 Fruit Progression

The game includes 11 different fruit types in a clear progression sequence:

1. 🍒 Cherry (10 points, radius: 12px) - **Smallest**
2. 🍓 Strawberry (20 points, radius: 16px)
3. 🍇 Grape (50 points, radius: 20px)
4. 🍊 Dekopon (100 points, radius: 26px)
5. 🍅 Persimmon (200 points, radius: 32px)
6. 🍎 Apple (500 points, radius: 40px)
7. 🍐 Pear (1000 points, radius: 48px)
8. 🍍 Pineapple (2000 points, radius: 58px)
9. 🍈 Melon (5000 points, radius: 70px)
10. 🥥 Coconut (10000 points, radius: 84px)
11. 🍉 Watermelon (20000 points, radius: 100px) - **Largest/Goal!**

**Spawning**: Initially, only the first 3-4 smallest fruits (Cherry, Strawberry, Grape, and sometimes Dekopon) are available to drop randomly.

## 🧪 Testing

The project includes end-to-end (e2e) tests using Playwright.

### Running Tests

1. **Run all e2e tests:**
   ```bash
   npm run test:e2e
   ```

2. **Run tests in UI mode (interactive):**
   ```bash
   npm run test:e2e:ui
   ```

3. **Run tests in headed mode (see browser):**
   ```bash
   npm run test:e2e:headed
   ```

4. **Run tests in debug mode:**
   ```bash
   npm run test:e2e:debug
   ```

### Test Coverage

The e2e tests cover:
- Game initialization and UI elements
- Fruit dropping mechanics
- Fruit merging functionality
- Score tracking
- Game over conditions
- High score persistence
- UI interactions and responsiveness

### Installing Playwright Browsers

If you're running tests for the first time, you may need to install Playwright browsers:

```bash
npx playwright install
```

## 🛠️ Technologies Used

- React 18
- Matter.js (2D physics engine)
- Vite (build tool)
- Playwright (e2e testing)
- CSS3 (styling)
- localStorage (high score persistence)

## 🎯 Game Mechanics

- **Physics**: Fruits have realistic physics with gravity, collision detection, and rolling
- **Merging**: Two identical fruits merge when they touch, creating the next fruit in the sequence
- **Game Over**: If any fruit crosses the Game Over line and stays there for 2 seconds, the game ends
- **High Score**: Your best score is saved in localStorage and displayed

## 📝 License

This project is open source and available for personal use.

Enjoy playing! 🎮
