const board = document.getElementById("board");
const movesEl = document.getElementById("moves");
const matchedEl = document.getElementById("matched");
const resetBtn = document.getElementById("resetBtn");

/*
  Game configuration
  ------------------
  8 pairs = 16 cards (4x4 grid)
*/
const symbols = ["A", "B", "C", "D", "E", "F", "G", "H"];

let cards = [];
let flippedCards = [];
let moves = 0;
let matchedPairs = 0;
let lockBoard = false;

/* ================= INIT ================= */

initGame();

function initGame() {
  board.innerHTML = "";

  moves = 0;
  matchedPairs = 0;
  flippedCards = [];
  lockBoard = false;

  movesEl.textContent = moves;
  matchedEl.textContent = `0 / ${symbols.length}`;

  // duplicate + shuffle symbols
  cards = shuffle([...symbols, ...symbols]);

  createBoard();
}

/* ================= BOARD ================= */

function createBoard() {
  cards.forEach(symbol => {
    const card = document.createElement("div");
    card.className = "card";
    card.textContent = symbol;

    card.addEventListener("click", () => handleFlip(card));

    board.appendChild(card);
  });
}

/* ================= GAME LOGIC ================= */

function handleFlip(card) {
  if (lockBoard) return;
  if (
    card.classList.contains("revealed") ||
    card.classList.contains("matched")
  )
    return;

  card.classList.add("revealed");
  flippedCards.push(card);

  if (flippedCards.length === 2) {
    lockBoard = true; // prevent fast third click
    moves++;
    movesEl.textContent = moves;
    checkMatch();
  }
}

function checkMatch() {
  const [first, second] = flippedCards;

  if (first.textContent === second.textContent) {
    markAsMatched(first, second);
  } else {
    unflipCards(first, second);
  }
}

function markAsMatched(first, second) {
  first.classList.add("matched");
  second.classList.add("matched");

  matchedPairs++;
  matchedEl.textContent = `${matchedPairs} / ${symbols.length}`;

  resetTurn();

  if (matchedPairs === symbols.length) {
    setTimeout(showCompletion, 300);
  }
}

function unflipCards(first, second) {
  setTimeout(() => {
    first.classList.remove("revealed");
    second.classList.remove("revealed");
    resetTurn();
  }, 700);
}

function resetTurn() {
  flippedCards = [];
  lockBoard = false;
}

/* ================= COMPLETION ================= */

function showCompletion() {
  alert(`Game completed in ${moves} moves`);
}

/* ================= UTIL ================= */

function shuffle(array) {
  return array.sort(() => Math.random() - 0.5);
}

/* ================= RESET ================= */

resetBtn.addEventListener("click", initGame);
