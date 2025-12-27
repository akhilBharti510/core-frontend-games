const boardEl = document.getElementById("board");
const scoreEl = document.getElementById("score");
const highScoreEl = document.getElementById("highScore");
const speedEl = document.getElementById("speed");

const startBtn = document.getElementById("startBtn");
const pauseBtn = document.getElementById("pauseBtn");
const resetBtn = document.getElementById("resetBtn");

const SIZE = 20;
const TOTAL = SIZE * SIZE;

let cells = [];
let snake = [];
let direction = 1;
let nextDirection = 1;
let food = 0;

let score = 0;
let speed = 150;
let loop = null;
let running = false;
let paused = false;

const highScore = Number(localStorage.getItem("snakeHighScore")) || 0;
highScoreEl.textContent = highScore;

/* ================= INIT ================= */

init();

function init() {
  createBoard();
  resetState();
  render();
}

function createBoard() {
  boardEl.innerHTML = "";
  cells = [];

  for (let i = 0; i < TOTAL; i++) {
    const div = document.createElement("div");
    div.className = "cell";
    boardEl.appendChild(div);
    cells.push(div);
  }
}

/* ================= GAME STATE ================= */

function resetState() {
  snake = [210, 209, 208];
  direction = 1;
  nextDirection = 1;

  score = 0;
  speed = 150;

  scoreEl.textContent = score;
  speedEl.textContent = "1x";

  placeFood();
}

/* ================= GAME LOOP ================= */

function startGame() {
  if (running) return;

  running = true;
  paused = false;

  startBtn.disabled = true;
  pauseBtn.disabled = false;
  resetBtn.disabled = false; // ✅ now visible & usable

  pauseBtn.textContent = "Pause";
  loop = setInterval(tick, speed);
}

function tick() {
  direction = nextDirection;
  const head = snake[0];
  const next = head + direction;

  if (isCollision(next)) {
    endGame();
    return;
  }

  snake.unshift(next);

  if (next === food) {
    score++;
    scoreEl.textContent = score;
    increaseSpeed();
    placeFood();
  } else {
    snake.pop();
  }

  render();
}

/* ================= LOGIC ================= */

function isCollision(pos) {
  return (
    pos < 0 ||
    pos >= TOTAL ||
    (direction === 1 && pos % SIZE === 0) ||
    (direction === -1 && pos % SIZE === SIZE - 1) ||
    snake.includes(pos)
  );
}

function placeFood() {
  do {
    food = Math.floor(Math.random() * TOTAL);
  } while (snake.includes(food));
}

function increaseSpeed() {
  if (speed > 70) {
    speed -= 5;
    speedEl.textContent = `${Math.round(150 / speed)}x`;
    clearInterval(loop);
    loop = setInterval(tick, speed);
  }
}

/* ================= RENDER ================= */

function render() {
  cells.forEach(c => c.classList.remove("snake", "food"));
  snake.forEach(i => cells[i].classList.add("snake"));
  cells[food].classList.add("food");
}

/* ================= CONTROLS ================= */

document.addEventListener("keydown", e => {
  if (!running) return;

  if (e.key === "ArrowUp" && direction !== SIZE) nextDirection = -SIZE;
  if (e.key === "ArrowDown" && direction !== -SIZE) nextDirection = SIZE;
  if (e.key === "ArrowLeft" && direction !== 1) nextDirection = -1;
  if (e.key === "ArrowRight" && direction !== -1) nextDirection = 1;

  if (e.key === " " && running) togglePause();
});

function togglePause() {
  if (!running) return;

  if (!paused) {
    clearInterval(loop);
    paused = true;
    pauseBtn.textContent = "Resume";
  } else {
    loop = setInterval(tick, speed);
    paused = false;
    pauseBtn.textContent = "Pause";
  }
}

/* ================= END / RESET ================= */

function endGame() {
  clearInterval(loop);
  running = false;

  pauseBtn.disabled = true;
  startBtn.disabled = false;
  resetBtn.disabled = false; // ✅ user clearly sees reset option

  if (score > highScore) {
    localStorage.setItem("snakeHighScore", score);
    highScoreEl.textContent = score;
  }
}


function resetGame() {
  clearInterval(loop);
  running = false;
  paused = false;

  startBtn.disabled = false;
  pauseBtn.disabled = true;
  resetBtn.disabled = true; // ✅ no confusion now

  resetState();
  render();
}


startBtn.addEventListener("click", startGame);
pauseBtn.addEventListener("click", togglePause);
resetBtn.addEventListener("click", resetGame);
