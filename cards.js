let errors = 0;
let score = 0;
let time = 0;
let timerInterval;

const cardList = [
  "darkness",
  "fairy",
  "fighting",
  "fire",
  "grass",
  "lightning",
  "metal",
  "psychic",
  "water"
];

let cardSet = [];
let rows = 3;
let columns = 6;
let card1 = null;
let card2 = null;
let matchedPairs = 0;
let gameStarted = false;

// Sounds
const flipSound = new Audio("sounds/flip.mp3");
const matchSound = new Audio("sounds/match.mp3");
const errorSound = new Audio("sounds/error.mp3");
const winSound = new Audio("sounds/win.mp3");
const bgMusic = new Audio("sounds/bg-music.mp3");
bgMusic.loop = true;

// Buttons
document.getElementById("restartBtn").addEventListener("click", restartGame);
document.getElementById("musicToggle").addEventListener("click", toggleMusic);
document.getElementById("playAgainBtn").addEventListener("click", restartGame);

// Start Banner Logic
window.addEventListener("load", () => {
  document.getElementById("startBanner").classList.remove("hide");
});

document.getElementById("startGameBtn").addEventListener("click", () => {
  if (gameStarted) return; // prevent double start
  gameStarted = true;

  document.getElementById("startBanner").classList.add("hide");
  setTimeout(startGame, 500);
});

function shuffleCards() {
  cardSet = cardList.concat(cardList);
  for (let i = cardSet.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [cardSet[i], cardSet[j]] = [cardSet[j], cardSet[i]];
  }
}

function startGame() {
  errors = 0;
  score = 0;
  matchedPairs = 0;
  document.getElementById("errors").innerText = 0;
  document.getElementById("score").innerText = 0;
  document.getElementById("timer").innerText = "0s";
  document.getElementById("restartBtn").disabled = false;

  shuffleCards();
  createBoard();
  startTimer();
  bgMusic.play();
}

function createBoard() {
  const board = document.getElementById("board");
  board.innerHTML = "";

  for (let i = 0; i < rows * columns; i++) {
    const card = document.createElement("img");
    card.src = "images/back.jpg";
    card.dataset.value = cardSet[i];
    card.classList.add("card");
    card.addEventListener("click", flipCard);
    board.appendChild(card);
  }
}

function flipCard() {
  if (this === card1 || this === card2) return; // ignore double click on same card
  if (card1 && card2) return; // wait until match check done

  // Flip instantly
  this.src = "images/" + this.dataset.value + ".jpg";
  flipSound.currentTime = 0;
  flipSound.play();

  if (!card1) {
    card1 = this;
  } else {
    card2 = this;

    // Temporarily disable all clicks until check finishes
    document.querySelectorAll(".card").forEach(c => c.style.pointerEvents = "none");

    setTimeout(checkMatch, 500); // short delay for visual
  }
}

function checkMatch() {
  if (!card1 || !card2) return;

  if (card1.dataset.value === card2.dataset.value) {
    // ✅ Correct pair
    matchSound.currentTime = 0;
    matchSound.play();
    score += 10;
    matchedPairs++;

    card1.classList.add("matched");
    card2.classList.add("matched");
    card1.style.pointerEvents = "none";
    card2.style.pointerEvents = "none";

    if (matchedPairs === (rows * columns) / 2) {
      clearInterval(timerInterval);
      winSound.currentTime = 0;
      winSound.play();
      document.getElementById("winBanner").classList.add("show");
    }
  } else {
    // ❌ Wrong pair
    errorSound.currentTime = 0;
    errorSound.play();
    errors++;
    document.getElementById("errors").innerText = errors;

    setTimeout(() => {
      card1.src = "images/back.jpg";
      card2.src = "images/back.jpg";
    }, 400);
  }

  // Re-enable cards + reset selections
  setTimeout(() => {
    card1 = null;
    card2 = null;
    document.querySelectorAll(".card:not(.matched)").forEach(c => c.style.pointerEvents = "auto");
    document.getElementById("score").innerText = score;
  }, 600);
}

  card1 = null;
  card2 = null;
  document.getElementById("score").innerText = score;
}

function startTimer() {
  time = 0;
  clearInterval(timerInterval);
  timerInterval = setInterval(() => {
    time++;
    document.getElementById("timer").innerText = time + "s";
  }, 1000);
}

function restartGame() {
  document.getElementById("winBanner").classList.remove("show");
  clearInterval(timerInterval);
  bgMusic.pause();
  gameStarted = false;
  document.getElementById("startBanner").classList.remove("hide");
}

function toggleMusic() {
  if (bgMusic.paused) bgMusic.play();
  else bgMusic.pause();
}

