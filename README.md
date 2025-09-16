# 2048 Game

This is a web-based re-creation of the classic 2048 tile-merging puzzle game, built with Next.js and React. It includes modern features like undo, persistent game state, and an AI-powered hint system.

## How to Play

The goal of the game is to slide numbered tiles on a grid to combine them and create a tile with the number 2048.

- **Use your arrow keys** on a desktop or **swipe** on a touch device to move all tiles in a direction (Up, Down, Left, or Right).
- When two tiles with the same number touch, they **merge into one** with a value equal to their sum.
- After every move, a new tile (either a 2 or a 4) will appear in a random empty spot on the board.
- The game ends when the board is full and there are no more possible moves.

## Features

- **Classic 2048 Gameplay**: Enjoy the timeless puzzle game you know and love.
- **Responsive Design**: Play on any device, whether it's your desktop, tablet, or smartphone. The interface adapts to any screen size.
- **Undo Move**: Made a mistake? Use the "Undo" button or press `Ctrl+Z` to go back one step.
- **Persistent Game State**: Your current game is automatically saved. You can close the browser and resume your session later.
- **Best Score Tracking**: The game keeps track of your highest score. You can reset it by clicking on the "BEST" score display.
- **AI Hints**: Feeling stuck? Click the "Get a Hint" button to receive an AI-powered analysis of your board and suggestions for your next move.

## Getting Started

This is a web application that runs directly in your browser. No installation is required.

### AI Hint Feature Setup

To enable the AI-powered "Hint" feature, you need a Google AI API key.

1.  Obtain an API key from [Google AI Studio](https://aistudio.google.com/app/apikey).
2.  Create a file named `.env` in the root of the project.
3.  Add your API key to the `.env` file like this:
    ```
    GEMINI_API_KEY=YOUR_API_KEY_HERE
    ```

## Platform Support

This is a web application, which means it runs on any modern web browser. You can play it on:
-   **Desktop**: Windows, macOS, and Linux
-   **Mobile**: Android and iOS
-   Any other device with a web browser.
