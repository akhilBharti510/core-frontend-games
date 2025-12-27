const textEl = document.getElementById("text");
const inputEl = document.getElementById("input");
const timeEl = document.getElementById("time");
const wpmEl = document.getElementById("wpm");
const accuracyEl = document.getElementById("accuracy");
const bestWpmEl = document.getElementById("bestWpm");

const startBtn = document.getElementById("startBtn");
const resetBtn = document.getElementById("resetBtn");
const durationSelect = document.getElementById("duration");

let timer = null;
let timeLeft = 0;
let started = false;

let paragraphPool = [];
let poolIndex = 0;
let rawText = "";

bestWpmEl.textContent = localStorage.getItem("bestWpm") || 0;

/* ================= INIT ================= */

init();

async function init() {
  await fetchParagraphPool();
  textEl.textContent = "Click start to load a typing test.";
}

/* ================= FETCH POOL ================= */

async function fetchParagraphPool() {
  try {
    const res = await fetch(
      "https://api.quotable.io/quotes?limit=30&minLength=120&maxLength=220"
    );
    const data = await res.json();

    paragraphPool = data.results.map(q => q.content);
    shuffle(paragraphPool);
    poolIndex = 0;
  } catch {
    paragraphPool = [
      "Consistent typing practice improves speed accuracy and long term confidence.",
      "Frontend development requires focus clean logic and attention to detail.",
      "Strong fundamentals help developers write scalable and maintainable code."
    ];
    poolIndex = 0;
  }
}

/* ================= EVENTS ================= */

startBtn.addEventListener("click", startTest);
resetBtn.addEventListener("click", resetTest);
inputEl.addEventListener("input", handleTyping);

/* ================= START ================= */

async function startTest() {
  if (started) return;

  started = true;
  startBtn.disabled = true;
  durationSelect.disabled = true;

  inputEl.value = "";
  inputEl.disabled = true;

  timeLeft = Number(durationSelect.value);
  timeEl.textContent = timeLeft;
  wpmEl.textContent = 0;
  accuracyEl.textContent = 100;

  // 🔥 ALWAYS NEW PARAGRAPH HERE
  if (poolIndex >= paragraphPool.length) {
    await fetchParagraphPool();
  }

  rawText = paragraphPool[poolIndex++];
  renderText("");

  inputEl.disabled = false;
  inputEl.focus();

  timer = setInterval(() => {
    timeLeft--;
    timeEl.textContent = timeLeft;
    if (timeLeft === 0) endTest();
  }, 1000);
}

/* ================= TYPING ================= */

function handleTyping() {
  if (!started) return;

  const typed = inputEl.value;
  renderText(typed);
  calculateStats(typed);

  if (typed === rawText) {
    endTest();
  }
}

function renderText(typed) {
  textEl.innerHTML = "";

  rawText.split("").forEach((char, i) => {
    const span = document.createElement("span");

    if (typed[i] == null) span.className = "pending";
    else if (typed[i] === char) span.className = "correct";
    else span.className = "incorrect";

    span.textContent = char;
    textEl.appendChild(span);
  });
}

/* ================= STATS ================= */

function calculateStats(typed) {
  const words = typed.trim().split(/\s+/).filter(Boolean).length;
  const minutes = (Number(durationSelect.value) - timeLeft) / 60;
  const wpm = minutes > 0 ? Math.round(words / minutes) : 0;

  let correctChars = 0;
  for (let i = 0; i < typed.length; i++) {
    if (typed[i] === rawText[i]) correctChars++;
  }

  const accuracy =
    typed.length > 0
      ? Math.round((correctChars / typed.length) * 100)
      : 100;

  wpmEl.textContent = wpm;
  accuracyEl.textContent = accuracy;
}

/* ================= END ================= */

function endTest() {
  if (!started) return;

  clearInterval(timer);
  started = false;

  inputEl.disabled = true;
  startBtn.disabled = false;
  durationSelect.disabled = false;

  const finalWpm = Number(wpmEl.textContent);
  const best = Number(localStorage.getItem("bestWpm") || 0);

  if (finalWpm > best) {
    localStorage.setItem("bestWpm", finalWpm);
    bestWpmEl.textContent = finalWpm;
  }
}

/* ================= RESET ================= */

function resetTest() {
  clearInterval(timer);
  started = false;

  startBtn.disabled = false;
  durationSelect.disabled = false;

  inputEl.value = "";
  inputEl.disabled = true;

  timeLeft = Number(durationSelect.value);
  timeEl.textContent = timeLeft;
  wpmEl.textContent = 0;
  accuracyEl.textContent = 100;

  textEl.textContent = "Click start to load a typing test.";
}

/* ================= UTIL ================= */

function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}
