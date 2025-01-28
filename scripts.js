const cells = document.querySelectorAll('.cell');
const startButton = document.getElementById('start');
const winnerDisplay = document.getElementById('winner');
let currentPlayer = 'X';
let board = ['', '', '', '', '', '', '', '', ''];
let gameHistory = {};
let playerHistory = [];
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
    playerHistory.push(board.join(''));

    if (checkWinner()) {
        gameOver = true;
        updateGameHistory(currentPlayer); // Pass current player to updateGameHistory
        setTimeout(() => {
            winnerDisplay.textContent = `Player ${currentPlayer} wins!`;
            startButton.classList.remove('hidden'); // Show the Start Game button again
        }, 100);
        return; // Return early to prevent switching players after winning move
    } else if (board.every(cell => cell !== '')) {
        gameOver = true;
        updateGameHistory(null); // Pass null to indicate a draw
        setTimeout(() => {
            winnerDisplay.textContent = 'It\'s a draw!';
            startButton.classList.remove('hidden'); // Show the Start Game button again
        }, 100);
        return; // Return early to prevent switching players after draw
    }
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
}

function makeAIMove() {
    const emptyCells = board.map((value, index) => value === '' ? index : null).filter(value => value !== null);
    const currentBoardState = board.join('');

    if (!gameHistory[currentBoardState]) {
        gameHistory[currentBoardState] = { wins: 0, losses: 0, draws: 0 };
    }

    let bestMoveIndex = emptyCells[0];
    let bestScore = -Infinity;

    // Evaluate possible moves
    emptyCells.forEach(index => {
        board[index] = 'O';
        const newBoardState = board.join('');
        if (!gameHistory[newBoardState]) {
            gameHistory[newBoardState] = { wins: 0, losses: 0, draws: 0 };
        }
        let score = gameHistory[newBoardState].wins - gameHistory[newBoardState].losses;

        // Adjust score based on player's history
        playerHistory.forEach(playerMove => {
            if (playerMove === newBoardState) {
                score -= 1; // Reduce score if the player has previously made this move
            }
        });

        board[index] = '';

        if (score > bestScore) {
            bestScore = score;
            bestMoveIndex = index;
        }
    });

    // Randomize the move selection to avoid repetitive patterns
    bestMoveIndex = emptyCells[Math.floor(Math.random() * emptyCells.length)];

    const aiCell = cells[bestMoveIndex];
    makeMove(aiCell, bestMoveIndex);
}

function restartGame() {
    board = ['', '', '', '', '', '', '', '', ''];
    playerHistory = []; // Clear player history
    cells.forEach(cell => {
        cell.textContent = '';
        cell.style.color = ''; // Reset color
    });
    winnerDisplay.textContent = ''; // Clear winner display
    currentPlayer = 'X';
    gameOver = false;
}

function updateGameHistory(winner) {
    const boardState = board.join('');
    if (!gameHistory[boardState]) {
        gameHistory[boardState] = { wins: 0, losses: 0, draws: 0 };
    }
    if (winner === 'X') {
        gameHistory[boardState].wins += 1; // Increment wins for X
    } else if (winner === 'O') {
        gameHistory[boardState].losses += 1; // Increment losses for O
    } else if (winner === null) {
        gameHistory[boardState].draws += 1;
    }
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
