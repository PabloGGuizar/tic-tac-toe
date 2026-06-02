# X · O: Tic-Tac-Toe

[Leer en Español](README.md)

A modern and dynamic Tic-Tac-Toe game built with React. It's not just the classic game; it also features an Artificial Intelligence engine capable of analyzing its moves, along with a panel to visualize how the AI "thinks" when making decisions using the Minimax algorithm.

## 🤖 The Minimax Algorithm
The engine of this game uses the **Minimax** algorithm, a decision rule used in game theory and artificial intelligence to minimize the possible maximum loss.

In practice, the AI simulates all possible future moves until the end of the game (win, lose, or draw) and evaluates the outcomes:
- **+10 points** if the AI wins.
- **-10 points** if the human wins.
- **0 points** for a draw.

The AI assumes that the human player will also play optimally. Therefore, it chooses the move that maximizes its minimum possible score, assuming the opponent is trying to minimize it. This guarantees that the AI on the hardest difficulty is mathematically unbeatable (at worst, the game will always end in a draw).

## 🚀 Key Features
- **Artificial Intelligence (Minimax):** Play against an unbeatable AI on hard difficulty, or lower the challenge to medium or easy.
- **Decision Tree Visualizer:** Watch in real-time the possible moves the AI is evaluating and the assigned score for each move.
- **Dark / Light Mode:** Toggle the interface appearance with a single click.
- **Multilingual:** Interface fully supported in English and Spanish.
- **Game Reports:** After the match, generate and review a detailed move-by-move report to analyze how the game unfolded.

## 💻 How to Run Locally
1. Clone this repository to your computer.
2. Install dependencies by running `npm install`.
3. Start the development server with `npm run dev`.
4. Open the local address in your browser to start playing.

---
*Developed by [Pablo G. Guízar](https://www.linkedin.com/in/pablogguizar/) | MIT License*
