const buttons = document.querySelectorAll(".choices button");
const resultText = document.getElementById("resultText");
const playerScoreEl = document.getElementById("playerScore");
const computerScoreEl = document.getElementById("computerScore");
const historyList = document.getElementById("historyList");
const resetBtn = document.getElementById("resetBtn");

const formatButtons = document.querySelectorAll(".format-options button");

const choices = ["rock", "paper", "scissors"];

let MAX_ROUNDS = 3; // default
let roundCount = 0;

let playerScore = Number(localStorage.getItem("rpsPlayer")) || 0;
let computerScore = Number(localStorage.getItem("rpsComputer")) || 0;

updateScore();

/* ================= FORMAT SELECTION ================= */

formatButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    if (roundCount > 0) return; // lock format after match starts

    formatButtons.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");

    MAX_ROUNDS = Number(btn.dataset.rounds);
    resultText.textContent = `Best of ${MAX_ROUNDS}. Choose your move`;
  });
});

/* ================= GAME PLAY ================= */

buttons.forEach(btn => {
  btn.addEventListener("click", () => {
    if (roundCount >= MAX_ROUNDS) return;

    selectUI(btn);
    playRound(btn.dataset.choice);
  });
});

document.addEventListener("keydown", e => {
  if (roundCount >= MAX_ROUNDS) return;

  if (e.key.toLowerCase() === "r") playRound("rock");
  if (e.key.toLowerCase() === "p") playRound("paper");
  if (e.key.toLowerCase() === "s") playRound("scissors");
});

function playRound(playerChoice) {
  const computerChoice = getComputerChoice();
  roundCount++;

  let outcome;

  if (playerChoice === computerChoice) {
    outcome = "Draw";
  } else if (
    (playerChoice === "rock" && computerChoice === "scissors") ||
    (playerChoice === "paper" && computerChoice === "rock") ||
    (playerChoice === "scissors" && computerChoice === "paper")
  ) {
    playerScore++;
    outcome = "You win";
  } else {
    computerScore++;
    outcome = "You lose";
  }

  updateScore();
  updateHistory(playerChoice, computerChoice, outcome);
  updateResult(outcome, playerChoice, computerChoice);

  if (roundCount === MAX_ROUNDS) {
    endMatch();
  }
}

/* ================= UI HELPERS ================= */

function updateResult(outcome, player, computer) {
  resultText.textContent =
    outcome === "Draw"
      ? "Draw round"
      : `${outcome} — ${player} vs ${computer}`;
}

function updateHistory(player, computer, outcome) {
  const li = document.createElement("li");
  li.textContent = `${player} vs ${computer} → ${outcome}`;
  historyList.prepend(li);

  if (historyList.children.length > 5) {
    historyList.removeChild(historyList.lastChild);
  }
}

function selectUI(activeBtn) {
  buttons.forEach(b => b.classList.remove("selected"));
  activeBtn.classList.add("selected");
}

/* ================= SCORE & STATE ================= */

function getComputerChoice() {
  return choices[Math.floor(Math.random() * choices.length)];
}

function updateScore() {
  playerScoreEl.textContent = playerScore;
  computerScoreEl.textContent = computerScore;

  localStorage.setItem("rpsPlayer", playerScore);
  localStorage.setItem("rpsComputer", computerScore);
}

function endMatch() {
  resultText.textContent =
    playerScore === computerScore
      ? "Match drawn"
      : playerScore > computerScore
      ? "You won the match"
      : "Computer won the match";
}

/* ================= RESET ================= */

resetBtn.addEventListener("click", () => {
  playerScore = 0;
  computerScore = 0;
  roundCount = 0;
  historyList.innerHTML = "";

  updateScore();
  resultText.textContent = `Best of ${MAX_ROUNDS}. Choose your move`;

  buttons.forEach(b => b.classList.remove("selected"));
});
