const cells = document.querySelectorAll('.cell');
const startButton = document.getElementById('start');
const winnerDisplay = document.getElementById('winner');
let currentPlayer = 'X';
let board = ['', '', '', '', '', '', '', '', ''];
let gameHistory = {};
let gameOver = false;

// Initialize game history with empty board states
function initializeGameHistory() {
    const emptyBoardState = '.........';
    if (!gameHistory[emptyBoardState]) {
        gameHistory[emptyBoardState] = { wins: 0, losses: 0, draws: 0 };
    }
}

initializeGameHistory();

cells.forEach((cell, index) => {
    cell.addEventListener('click', () => {
        if (cell.textContent === '' && currentPlayer === 'X' && !gameOver) {
            makeMove(cell, index);
            if (!gameOver) {
                setTimeout(makeAIMove, 500); // AI makes a move after 0.5 seconds
            }
        }
    });
});

startButton.addEventListener('click', startGame);

function startGame() {
    restartGame();
    startButton.classList.add('hidden'); // Hide the Start Game button
}

function makeMove(cell, index) {
    cell.textContent = currentPlayer;
    cell.style.color = currentPlayer === 'X' ? '#FF4500' : '#1E90FF'; // Change colors: OrangeRed for X and DodgerBlue for O
    board[index] = currentPlayer;

    if (checkWinner()) {
        gameOver = true;
        setTimeout(() => {
            winnerDisplay.textContent = `Player ${currentPlayer} wins!`;
            startButton.classList.remove('hidden'); // Show the Start Game button again
        }, 100);
        return; // Return early to prevent switching players after winning move
    } else if (board.every(cell => cell !== '')) {
        gameOver = true;
        setTimeout(() => {
            winnerDisplay.textContent = 'It\'s a draw!';
            startButton.classList.remove('hidden'); // Show the Start Game button again
        }, 100);
        return; // Return early to prevent switching players after draw
    }
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
}

function makeAIMove() {
    const bestMove = findBestMove(board);
    const aiCell = cells[bestMove];
    makeMove(aiCell, bestMove);
}

function findBestMove(board) {
    let bestScore = -Infinity;
    let move;

    board.forEach((cell, index) => {
        if (cell === '') {
            board[index] = 'O';
            let score = minimax(board, 0, false);
            board[index] = '';
            if (score > bestScore) {
                bestScore = score;
                move = index;
            }
        }
    });

    return move;
}

function minimax(board, depth, isMaximizing) {
    const winner = checkWinnerMinimax(board);
    if (winner !== null) {
        return winner === 'O' ? 10 - depth : depth - 10;
    } else if (board.every(cell => cell !== '')) {
        return 0; // Draw
    }

    if (isMaximizing) {
        let bestScore = -Infinity;
        board.forEach((cell, index) => {
            if (cell === '') {
                board[index] = 'O';
                let score = minimax(board, depth + 1, false);
                board[index] = '';
                bestScore = Math.max(score, bestScore);
            }
        });
        return bestScore;
    } else {
        let bestScore = Infinity;
        board.forEach((cell, index) => {
            if (cell === '') {
                board[index] = 'X';
                let score = minimax(board, depth + 1, true);
                board[index] = '';
                bestScore = Math.min(score, bestScore);
            }
        });
        return bestScore;
    }
}

function checkWinnerMinimax(board) {
    const winningCombinations = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7],
        [2, 5, 8], [0, 4, 8], [2, 4, 6]
    ];

    for (const combination of winningCombinations) {
        const [a, b, c] = combination;
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            return board[a];
        }
    }

    return null;
}

function restartGame() {
    board = ['', '', '', '', '', '', '', '', ''];
    cells.forEach(cell => {
        cell.textContent = '';
        cell.style.color = ''; // Reset color
    });
    winnerDisplay.textContent = ''; // Clear winner display
    currentPlayer = 'X';
    gameOver = false;
}

function checkWinner() {
    const winningCombinations = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7],
        [2, 5, 8], [0, 4, 8], [2, 4, 6]
    ];

    for (const combination of winningCombinations) {
        const [a, b, c] = combination;
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            return true;
        }
    }

    return false;
}
