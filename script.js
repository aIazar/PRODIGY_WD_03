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

function makeMove(index, player) {
    board[index] = player;
    cells[index].textContent = player;
    cells[index].classList.add(player.toLowerCase());
    cells[index].classList.add('disabled');
}

function checkWinner() {
    for (let condition of winningConditions) {
        const [a, b, c] = condition;
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            return true;
        }
    }
    return false;
}

function getWinningCombination() {
    for (let condition of winningConditions) {
        const [a, b, c] = condition;
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            return condition;
        }
    }
    return null;
}

function highlightWinningCells() {
    const winningCombo = getWinningCombination();
    if (winningCombo) {
        winningCombo.forEach(index => {
            cells[index].classList.add('winning');
        });
    }
}

function checkDraw() {
    return board.every(cell => cell !== '');
}

function disableAllCells() {
    cells.forEach(cell => {
        cell.classList.add('disabled');
    });
}

function makeAIMove() {
    if (!gameActive) return;
    
    let bestMove = getBestMove();
    if (bestMove !== -1) {
        makeMove(bestMove, 'O');
        
        if (checkWinner()) {
            gameActive = false;
            scores['O']++;
            updateScore();
            statusElement.textContent = 'AI Wins!';
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
        
        currentPlayer = 'X';
        statusElement.textContent = `Player ${currentPlayer}'s Turn`;
    }
}

function getBestMove() {
    let bestScore = -Infinity;
    let bestMove = -1;
    
    for (let i = 0; i < 9; i++) {
        if (board[i] === '') {
            board[i] = 'O';
            let score = minimax(board, 0, false);
            board[i] = '';
            
            if (score > bestScore) {
                bestScore = score;
                bestMove = i;
            }
        }
    }
    
    return bestMove;
}

function minimax(board, depth, isMaximizing) {
    if (checkWinnerForPlayer('O')) {
        return 10 - depth;
    }
    if (checkWinnerForPlayer('X')) {
        return depth - 10;
    }
    if (checkDraw()) {
        return 0;
    }
    
    if (isMaximizing) {
        let bestScore = -Infinity;
        for (let i = 0; i < 9; i++) {
            if (board[i] === '') {
                board[i] = 'O';
                let score = minimax(board, depth + 1, false);
                board[i] = '';
                bestScore = Math.max(score, bestScore);
            }
        }
        return bestScore;
    } else {
        let bestScore = Infinity;
        for (let i = 0; i < 9; i++) {
            if (board[i] === '') {
                board[i] = 'X';
                let score = minimax(board, depth + 1, true);
                board[i] = '';
                bestScore = Math.min(score, bestScore);
            }
        }
        return bestScore;
    }
}

function checkWinnerForPlayer(player) {
    for (let condition of winningConditions) {
        const [a, b, c] = condition;
        if (board[a] === player && board[b] === player && board[c] === player) {
            return true;
        }
    }
    return false;
}

function updateScore() {
    scoreXElement.textContent = scores.X;
    scoreOElement.textContent = scores.O;
}

resetBtn.addEventListener('click', () => {
    initGame();
});

twoPlayerBtn.addEventListener('click', () => {
    gameMode = 'twoPlayer';
    twoPlayerBtn.classList.add('active');
    aiPlayerBtn.classList.remove('active');
    initGame();
});

aiPlayerBtn.addEventListener('click', () => {
    gameMode = 'ai';
    aiPlayerBtn.classList.add('active');
    twoPlayerBtn.classList.remove('active');
    scores = { X: 0, O: 0 };
    updateScore();
    initGame();
});

initGame();

