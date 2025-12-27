const boardEl = document.getElementById("board");
const statusText = document.getElementById("statusText");
const resetBtn = document.getElementById("resetBtn");
const modeSelect = document.getElementById("mode"); 
// modeSelect value: "pvp" | "ai"

let board = Array(9).fill(null);
let currentPlayer = "X";
let gameActive = true;
let gameMode = "pvp";

const WIN_PATTERNS = [
  [0,1,2], [3,4,5], [6,7,8],
  [0,3,6], [1,4,7], [2,5,8],
  [0,4,8], [2,4,6]
];

init();

/* ================= INIT ================= */

function init() {
  boardEl.innerHTML = "";
  board = Array(9).fill(null);
  currentPlayer = "X";
  gameActive = true;
  gameMode = modeSelect?.value || "pvp";

  statusText.textContent = "Player X's turn";

  board.forEach((_, index) => {
    const cell = document.createElement("div");
    cell.className = "cell";
    cell.addEventListener("click", () => handleMove(index, cell));
    boardEl.appendChild(cell);
  });
}

/* ================= GAME FLOW ================= */

function handleMove(index, cell) {
  if (!gameActive || board[index]) return;

  makeMove(index, currentPlayer);

  if (checkGameEnd()) return;

  currentPlayer = currentPlayer === "X" ? "O" : "X";
  statusText.textContent = `Player ${currentPlayer}'s turn`;

  if (gameMode === "ai" && currentPlayer === "O") {
    setTimeout(aiMove, 300); // small human-like delay
  }
}

function makeMove(index, player) {
  board[index] = player;
  boardEl.children[index].textContent = player;
  boardEl.children[index].classList.add("disabled");
}

/* ================= AI ================= */

function aiMove() {
  if (!gameActive) return;

  const bestMove = minimax(board, "O").index;
  makeMove(bestMove, "O");

  if (checkGameEnd()) return;

  currentPlayer = "X";
  statusText.textContent = "Player X's turn";
}

function minimax(newBoard, player) {
  const available = newBoard
    .map((v, i) => (v === null ? i : null))
    .filter(v => v !== null);

  if (checkWinner(newBoard, "X")) return { score: -10 };
  if (checkWinner(newBoard, "O")) return { score: 10 };
  if (available.length === 0) return { score: 0 };

  const moves = [];

  for (let i of available) {
    const move = {};
    move.index = i;
    newBoard[i] = player;

    move.score =
      player === "O"
        ? minimax(newBoard, "X").score
        : minimax(newBoard, "O").score;

    newBoard[i] = null;
    moves.push(move);
  }

  return player === "O"
    ? moves.reduce((best, m) => (m.score > best.score ? m : best))
    : moves.reduce((best, m) => (m.score < best.score ? m : best));
}

/* ================= CHECKS ================= */

function checkGameEnd() {
  const winPattern = getWinningPattern();
  if (winPattern) {
    highlightWin(winPattern);
    statusText.textContent = `Player ${currentPlayer} wins`;
    gameActive = false;
    return true;
  }

  if (board.every(cell => cell !== null)) {
    statusText.textContent = "Game drawn";
    gameActive = false;
    return true;
  }

  return false;
}

function getWinningPattern() {
  return WIN_PATTERNS.find(pattern =>
    pattern.every(i => board[i] === currentPlayer)
  );
}

function checkWinner(b, player) {
  return WIN_PATTERNS.some(pattern =>
    pattern.every(i => b[i] === player)
  );
}

function highlightWin(pattern) {
  pattern.forEach(i =>
    boardEl.children[i].classList.add("win")
  );
}

/* ================= RESET ================= */

resetBtn.addEventListener("click", init);
modeSelect?.addEventListener("change", init);
