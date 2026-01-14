let board = ['', '', '', '', '', '', '', '', ''];
let currentPlayer = 'X';
let gameMode = 'twoPlayer';
let gameActive = true;
let scores = { X: 0, O: 0 };

const cells = document.querySelectorAll('.cell');
const statusElement = document.getElementById('status');
const resetBtn = document.getElementById('resetBtn');
const twoPlayerBtn = document.getElementById('twoPlayerBtn');
const aiPlayerBtn = document.getElementById('aiPlayerBtn');
const scoreXElement = document.getElementById('scoreX');
const scoreOElement = document.getElementById('scoreO');

const winningConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

function initGame() {
    board = ['', '', '', '', '', '', '', '', ''];
    currentPlayer = 'X';
    gameActive = true;
    statusElement.textContent = `Player ${currentPlayer}'s Turn`;
    statusElement.classList.remove('winner', 'draw');
    
    cells.forEach((cell, index) => {
        cell.textContent = '';
        cell.classList.remove('x', 'o', 'disabled', 'winning');
        cell.addEventListener('click', () => handleCellClick(index));
    });
}

function handleCellClick(index) {
    if (board[index] !== '' || !gameActive) {
        return;
    }
    
    makeMove(index, currentPlayer);
    
    if (checkWinner()) {
        gameActive = false;
        scores[currentPlayer]++;
        updateScore();
        statusElement.textContent = `Player ${currentPlayer} Wins!`;
        statusElement.classList.add('winner');
        highlightWinningCells();
        disableAllCells();
        return;
    }
    
    if (checkDraw()) {
        gameActive = false;
        statusElement.textContent = "It's a Draw!";
        statusElement.classList.add('draw');
        disableAllCells();
        return;
    }
    
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    statusElement.textContent = `Player ${currentPlayer}'s Turn`;
    
    if (gameMode === 'ai' && currentPlayer === 'O' && gameActive) {
        setTimeout(() => {
            makeAIMove();
        }, 500);
    }
}

