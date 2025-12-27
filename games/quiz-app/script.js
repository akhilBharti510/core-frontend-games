const questionEl = document.getElementById("question");
const optionsEl = document.getElementById("options");
const nextBtn = document.getElementById("nextBtn");
const progressText = document.getElementById("progressText");
const progressFill = document.getElementById("progressFill");
const timerEl = document.getElementById("timer");

let index = 0;
let score = 0;
let selectedOption = null;
let locked = false;

let time = 15;
let timer;

const quiz = shuffle([...questions]);

function loadQuestion() {
  clearInterval(timer);

  locked = false;
  selectedOption = null;
  time = 20;

  timerEl.textContent = `${time}s`;
  nextBtn.disabled = true;
  nextBtn.textContent = "Submit";

  const q = quiz[index];
  questionEl.textContent = q.question;

  progressText.textContent = `${index + 1} / ${quiz.length}`;
  progressFill.style.width = `${((index + 1) / quiz.length) * 100}%`;

  optionsEl.innerHTML = "";

  shuffle([...q.options]).forEach(opt => {
    const btn = document.createElement("button");
    btn.className = "option";
    btn.textContent = opt;

    btn.addEventListener("click", () => selectOption(btn));
    optionsEl.appendChild(btn);
  });

  startTimer();
}

function selectOption(btn) {
  if (locked) return;

  [...optionsEl.children].forEach(b =>
    b.classList.remove("selected")
  );

  btn.classList.add("selected");
  selectedOption = btn.textContent;
  nextBtn.disabled = false;
}

function submitAnswer() {
  locked = true;
  clearInterval(timer);

  const correct =
    quiz[index].options[quiz[index].answer];

  [...optionsEl.children].forEach(btn => {
    btn.disabled = true;

    if (btn.textContent === correct)
      btn.classList.add("correct");

    if (
      btn.textContent === selectedOption &&
      selectedOption !== correct
    )
      btn.classList.add("wrong");
  });

  if (selectedOption === correct) score++;

  nextBtn.textContent = "Next →";
}

function startTimer() {
  timer = setInterval(() => {
    time--;
    timerEl.textContent = `${time}s`;

    if (time === 0) {
      clearInterval(timer);
      if (selectedOption) submitAnswer();
      else {
        locked = true;
        nextBtn.textContent = "Next →";
        nextBtn.disabled = false;
      }
    }
  }, 1000);
}

nextBtn.addEventListener("click", () => {
  if (!locked) submitAnswer();
  else {
    index++;
    index < quiz.length ? loadQuestion() : showResult();
  }
});

function showResult() {
  localStorage.setItem("quizScore", score);

  document.querySelector(".quiz-container").innerHTML = `
    <section class="quiz-card">
      <h2>Quiz Completed</h2>
      <p>Score: <strong>${score}</strong> / ${quiz.length}</p>
      <button onclick="location.reload()">Restart Quiz</button>
    </section>
  `;
}

function shuffle(arr) {
  return arr.sort(() => Math.random() - 0.5);
}

document.addEventListener("keydown", e => {
  if (e.key >= "1" && e.key <= "4") {
    optionsEl.children[e.key - 1]?.click();
  }
  if (e.key === "Enter" && !nextBtn.disabled) {
    nextBtn.click();
  }
});

loadQuestion();
