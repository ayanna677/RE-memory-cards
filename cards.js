// --------------------
// Variables
// --------------------
let errors = 0,
    score = 0,
    time = 0,
    timerInterval;

let rows = 4,
    columns = 5;

let board = [],
    cardSet = [],
    card1 = null,
    card2 = null;

let gameStarted = false;

// Card types
const cardList = [
  "darkness","double","fairy","fighting","fire",
  "grass","lightning","metal","psychic","water"
];

// --------------------
// DOM Elements
// --------------------
const timerEl = document.getElementById("timer");
const errorsEl = document.getElementById("errors");
const scoreEl = document.getElementById("score");
const startBtn = document.getElementById("startBtn");
const restartBtn = document.getElementById("restartBtn");
const musicToggle = document.getElementById("musicToggle");
const boardDiv = document.getElementById("board");

// Sounds
const flipSound = document.getElementById("flipSound");
const matchSound = document.getElementById("matchSound");
const errorSound = document.getElementById("errorSound");
const winSound = document.getElementById("winSound");
const bgMusic = document.getElementById("bgMusic");

// --------------------
// Event Listeners
// --------------------
startBtn.addEventListener("click", () => {
  startBtn.disabled = true;
  restartBtn.disabled = false;
  resetGame();
  startGame();
});

restartBtn.addEventListener("click", () => {
  resetGame();
  startGame();
});

musicToggle.addEventListener("click", () => {
  if (bgMusic.paused) {
    bgMusic.play();
    musicToggle.textContent = "🔊";
  } else {
    bgMusic.pause();
    musicToggle.textContent = "🔇";
  }
});

// --------------------
// Functions
// --------------------

// Shuffle cards
function shuffleCards() {
  cardSet = cardList.concat(cardList);
  for (let i = 0; i < cardSet.length; i++) {
    let j = Math.floor(Math.random() * cardSet.length);
    [cardSet[i], cardSet[j]] = [cardSet[j], cardSet[i]];
  }
}

// Reset game
function resetGame() {
  clearInterval(timerInterval);
  boardDiv.innerHTML = "";
  board = [];
  errors = 0;
  score = 0;
  time = 0;
  card1 = null;
  card2 = null;

  errorsEl.innerText = errors;
  scoreEl.innerText = score;
  timerEl.innerText = time + "s";

  shuffleCards();
}

// Start game
function startGame() {
  boardDiv.innerHTML = "";
  for (let r = 0; r < rows; r++) {
    let row = [];
    for (let c = 0; c < columns; c++) {
      const cardImg = cardSet.pop();
      row.push(cardImg);

      const card = document.createElement("img");
      card.id = `${r}-${c}`;
      card.src = "images/back.jpg";
      card.classList.add("card");
      card.addEventListener("click", selectCard);
      boardDiv.append(card);
    }
    board.push(row);
  }

  startTimer();
}

// Timer
function startTimer() {
  timerInterval = setInterval(() => {
    time++;
    timerEl.innerText = time + "s";
  }, 1000);
}

// Card selection
function selectCard() {
  if (this.src.includes("back.jpg")) {
    flipSound.play();

    if (!card1) {
      card1 = this;
      revealCard(card1);
    } else if (!card2 && this !== card1) {
      card2 = this;
      revealCard(card2);
      setTimeout(checkMatch, 600);
    }
  }
}

// Reveal card
function revealCard(card) {
  const [r, c] = card.id.split("-").map(Number);
  card.src = `images/${board[r][c]}.jpg`;
}

// Check match
function checkMatch() {
  if (card1.src === card2.src) {
    matchSound.play();
    score += 10;
    scoreEl.innerText = score;

    card1.classList.add("matched");
    card2.classList.add("matched");

    if (document.querySelectorAll(".matched").length === rows * columns) {
      gameWin();
    }
  } else {
    errorSound.play();
    errors++;
    errorsEl.innerText = errors;

    setTimeout(() => {
      card1.src = "images/back.jpg";
      card2.src = "images/back.jpg";
    }, 300);
  }

  card1 = null;
  card2 = null;
}

// Win
function gameWin() {
  clearInterval(timerInterval);
  winSound.play();
  setTimeout(() => {
    alert(`🎉 You Win RE Protocol Memory Cards!\n⏱ Time: ${time}s\n❌ Errors: ${errors}\n⭐ Score: ${score}`);
  }, 200);
}
