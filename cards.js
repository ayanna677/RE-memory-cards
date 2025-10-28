let errors = 0;
let score = 0;
let time = 0;
let timerInterval;
let rows = 3;
let columns = 6;
let card1 = null;
let card2 = null;
let matchedPairs = 0;

const cardList = [
  "darkness", "fairy", "fighting", "fire", "grass",
  "lightning", "metal", "psychic", "water"
];

const flipSound = new Audio("sounds/flip.mp3");
const matchSound = new Audio("sounds/match.mp3");
const errorSound = new Audio("sounds/error.mp3");
const winSound = new Audio("sounds/win.mp3");
const bgMusic = new Audio("sounds/bg-music.mp3");
bgMusic.loop = true;

const boardDiv = document.getElementById("board");
const startBanner = document.getElementById("startBanner");
const winBanner = document.getElementById("winBanner");
const restartBtn = document.getElementById("restartBtn");
const startGameBtn = document.getElementById("startGameBtn");
const playAgainBtn = document.getElementById("playAgainBtn");
const musicToggle = document.getElementById("musicToggle");

window.addEventListener("load", () => {
  startBanner.classList.remove("hide");
});

startGameBtn.addEventListener("click", () => {
  startBanner.classList.add("hide");
  setTimeout(startGame, 300);
});

restartBtn.addEventListener("click", restartGame);
playAgainBtn.addEventListener("click", restartGame);
musicToggle.addEventListener("click", toggleMusic);

function shuffleCards() {
  const doubled = cardList.concat(cardList);
  for (let i = doubled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [doubled[i], doubled[j]] = [doubled[j], doubled[i]];
  }
  return doubled;
}

function startGame() {
  errors = 0;
  score = 0;
  time = 0;
  matchedPairs = 0;
  clearInterval(timerInterval);

  document.getElementById("errors").innerText = errors;
  document.getElementById("score").innerText = score;
  document.getElementById("timer").innerText = "0s";
  restartBtn.disabled = false;
  winBanner.classList.remove("show");

  createBoard();
  startTimer();

  bgMusic.currentTime = 0;
  bgMusic.play();
}

function createBoard() {
  const cardSet = shuffleCards();
  boardDiv.innerHTML = "";

  for (let i = 0; i < rows * columns; i++) {
    const cardName = cardSet[i];
    const card = document.createElement("img");
    card.src = "images/back.jpg";
    card.dataset.value = cardName;
    card.classList.add("card");
    card.addEventListener("click", () => flipCard(card));
    boardDiv.appendChild(card);
  }
}

function flipCard(card) {
  // Prevent flipping if already flipped or matched
  if (card === card1 || card.classList.contains("matched")) return;

  // Prevent flipping too fast
  if (card1 && card2) return;

  flipSound.currentTime = 0;
  flipSound.play();
  card.src = "images/" + card.dataset.value + ".jpg";

  if (!card1) {
    card1 = card;
  } else {
    card2 = card;
    document.querySelectorAll(".card").forEach(c => c.style.pointerEvents = "none");
    setTimeout(checkMatch, 600);
  }
}

function checkMatch() {
  if (!card1 || !card2) return;

  if (card1.dataset.value === card2.dataset.value) {
    // ✅ Correct match
    matchSound.currentTime = 0;
    matchSound.play();
    score += 10;
    matchedPairs++;
    card1.classList.add("matched");
    card2.classList.add("matched");
    card1.style.pointerEvents = "none";
    card2.style.pointerEvents = "none";
  } else {
    // ❌ Wrong match
    errorSound.currentTime = 0;
    errorSound.play();
    errors++;
    document.getElementById("errors").innerText = errors;
    setTimeout(() => {
      card1.src = "images/back.jpg";
      card2.src = "images/back.jpg";
    }, 500);
  }

  setTimeout(() => {
    card1 = null;
    card2 = null;
    document.querySelectorAll(".card:not(.matched)").forEach(c => (c.style.pointerEvents = "auto"));
    document.getElementById("score").innerText = score;

    // 🏆 Win check
    if (matchedPairs === (rows * columns) / 2) {
      clearInterval(timerInterval);
      winSound.currentTime = 0;
      winSound.play();
      winBanner.classList.add("show");
    }
  }, 700);
}

function startTimer() {
  clearInterval(timerInterval);
  timerInterval = setInterval(() => {
    time++;
    document.getElementById("timer").innerText = time + "s";
  }, 1000);
}

function restartGame() {
  winBanner.classList.remove("show");
  startGame();
}

function toggleMusic() {
  if (bgMusic.paused) {
    bgMusic.play();
  } else {
    bgMusic.pause();
  }
}
