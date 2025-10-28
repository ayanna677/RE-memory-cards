// =======================
// MEMORY CARD GAME SCRIPT (Optimized)
// =======================

let errors = 0,
  score = 0,
  time = 0,
  timerInterval,
  rows = 4,
  columns = 5,
  card1 = null,
  card2 = null,
  matchedPairs = 0;

// 🎵 Sounds
const flipSound = new Audio("sounds/flip.mp3");
const matchSound = new Audio("sounds/match.mp3");
const errorSound = new Audio("sounds/error.mp3");
const winSound = new Audio("sounds/win.mp3");
[flipSound, matchSound, errorSound, winSound].forEach(s => {
  s.preload = "auto";
  s.volume = 0.8;
});

// =======================
// 🪩 ON LOAD
// =======================
window.addEventListener("load", () => {
  document.getElementById("startBanner").classList.add("show");
});

// =======================
// 🕹️ START GAME
// =======================
function startGame() {
  document.getElementById("startBanner").classList.remove("show");
  document.getElementById("winBanner").classList.remove("show");

  // Reset stats
  errors = 0;
  score = 0;
  time = 0;
  matchedPairs = 0;
  card1 = card2 = null;

  document.getElementById("score").innerText = 0;
  document.getElementById("errors").innerText = 0;
  document.getElementById("time").innerText = "0";

  // Start timer
  clearInterval(timerInterval);
  timerInterval = setInterval(() => {
    time++;
    document.getElementById("time").innerText = time;
  }, 1000);

  createBoard();
}

// =======================
// 🎴 CREATE BOARD
// =======================
function createBoard() {
  const gameBoard = document.getElementById("gameBoard");
  gameBoard.innerHTML = "";

  // Make card pairs
  let cardValues = [];
  for (let i = 1; i <= (rows * columns) / 2; i++) {
    cardValues.push(i, i);
  }

  // Shuffle
  cardValues.sort(() => Math.random() - 0.5);

  // Create cards
  for (let value of cardValues) {
    const card = document.createElement("img");
    card.src = "images/back.jpg";
    card.dataset.value = value;
    card.classList.add("card");
    card.addEventListener("click", flipCard);
    gameBoard.appendChild(card);
  }
}

// =======================
// 🔄 FLIP CARD
// =======================
function flipCard() {
  if (this.classList.contains("flipped") || this.classList.contains("matched")) return;
  if (card1 && card2) return; // prevent third click

  this.classList.add("flipped");
  this.src = `images/${this.dataset.value}.jpg`;

  flipSound.currentTime = 0;
  flipSound.play();

  if (!card1) {
    card1 = this;
  } else {
    card2 = this;
    document.querySelectorAll(".card").forEach(c => (c.style.pointerEvents = "none"));
    setTimeout(checkMatch, 500);
  }
}

// =======================
// ✅ CHECK MATCH
// =======================
function checkMatch() {
  if (!card1 || !card2) return;

  if (card1.dataset.value === card2.dataset.value) {
    // ✅ Match
    matchSound.currentTime = 0;
    matchSound.play();

    card1.classList.add("matched");
    card2.classList.add("matched");
    score += 10;
    matchedPairs++;
  } else {
    // ❌ Wrong match
    errorSound.currentTime = 0;
    errorSound.play();
    errors++;

    setTimeout(() => {
      card1.src = "images/back.jpg";
      card2.src = "images/back.jpg";
      card1.classList.remove("flipped");
      card2.classList.remove("flipped");
    }, 400);
  }

  // Reset
  setTimeout(() => {
    document.getElementById("score").innerText = score;
    document.getElementById("errors").innerText = errors;

    card1 = null;
    card2 = null;
    document.querySelectorAll(".card:not(.matched)").forEach(c => (c.style.pointerEvents = "auto"));

    // 🎉 Win condition
    if (matchedPairs === (rows * columns) / 2) {
      clearInterval(timerInterval);
      winSound.currentTime = 0;
      winSound.play();

      setTimeout(() => {
        document.getElementById("winBanner").classList.add("show");
      }, 600);
    }
  }, 600);
}

// =======================
// 🔁 RESTART GAME
// =======================
function restartGame() {
  clearInterval(timerInterval);
  startGame();
}
