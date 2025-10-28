let errors = 0;
let score = 0;
let time = 0;
let timerInterval;

const cardList = [
  "darkness", "fairy", "fighting", "fire", "grass", "lightning", "metal", "psychic", "water"
];

let cardSet = [];
let rows = 3;
let columns = 6;
let card1 = null;
let card2 = null;
let matchedPairs = 0;

const flipSound = new Audio("sounds/flip.mp3");
const matchSound = new Audio("sounds/match.mp3");
const errorSound = new Audio("sounds/error.mp3");
const winSound = new Audio("sounds/win.mp3");
const bgMusic = new Audio("sounds/bg-music.mp3");
bgMusic.loop = true;

document.getElementById("restartBtn").addEventListener("click", restartGame);
document.getElementById("musicToggle").addEventListener("click", toggleMusic);

// 🟡 Show start banner when page loads
window.addEventListener("load", () => {
  document.getElementById("startBanner").classList.remove("hide");
});

// 🟢 Start game when clicking "Start Game"
document.getElementById("startGameBtn").addEventListener("click", () => {
  const startBanner = document.getElementById("startBanner");
  startBanner.classList.add("hide");

  setTimeout(() => {
    startGame();
  }, 600);
});

function shuffleCards() {
  cardSet = cardList.concat(cardList);
  for (let i = cardSet.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [cardSet[i], cardSet[j]] = [cardSet[j], cardSet[i]];
  }
}

function startGame() {
  document.getElementById("restartBtn").disabled = false;
  document.getElementById("winBanner").classList.remove("show");

  // Reset all game values
  errors = 0;
  score = 0;
  matchedPairs = 0;
  time = 0;
  document.getElementById("errors").innerText = 0;
  document.getElementById("score").innerText = 0;
  document.getElementById("timer").innerText = "0s";
  clearInterval(timerInterval);

  // Start timer immediately
  timerInterval = setInterval(() => {
    time++;
    document.getElementById("timer").innerText = time + "s";
  }, 1000);

  // Create and shuffle instantly
  shuffleCards();
  createBoard();

  // Play music
  bgMusic.play();
}

function createBoard() {
  const boardDiv = document.getElementById("board");
  boardDiv.innerHTML = "";

  for (let i = 0; i < rows * columns; i++) {
    const cardName = cardSet[i];
    const card = document.createElement("img");
    card.src = "images/back.jpg";
    card.dataset.value = cardName;
    card.classList.add("card");
    card.addEventListener("click", flipCard);
    boardDiv.appendChild(card);
  }
}

function flipCard() {
  if (this === card1 || this === card2) return;
  if (card1 && card2) return;

  // Flip instantly
  this.src = "images/" + this.dataset.value + ".jpg";
  flipSound.currentTime = 0;
  flipSound.play();

  if (!card1) {
    card1 = this;
  } else {
    card2 = this;
    document.querySelectorAll(".card").forEach(c => (c.style.pointerEvents = "none"));
    setTimeout(checkMatch, 400);
  }
}

function checkMatch() {
  if (!card1 || !card2) return;

  // Lock board during check
  document.querySelectorAll(".card").forEach(c => (c.style.pointerEvents = "none"));

  if (card1.dataset.value === card2.dataset.value) {
    // ✅ Match
    matchSound.currentTime = 0;
    matchSound.play();
    score += 10;
    matchedPairs++;
    card1.classList.add("matched");
    card2.classList.add("matched");
  } else {
    // ❌ Wrong match
    errorSound.currentTime = 0;
    errorSound.play();
    errors++;
    document.getElementById("errors").innerText = errors;

    // Flip back quickly
    setTimeout(() => {
      card1.src = "images/back.jpg";
      card2.src = "images/back.jpg";
    }, 500);
  }

  // Reset and re-enable cards
  setTimeout(() => {
    card1 = null;
    card2 = null;

    document.querySelectorAll(".card").forEach(c => {
      if (!c.classList.contains("matched")) c.style.pointerEvents = "auto";
    });

    document.getElementById("score").innerText = score;

    // 🎉 Win condition
    if (matchedPairs === (rows * columns) / 2) {
      clearInterval(timerInterval);
      winSound.currentTime = 0;
      winSound.play();
      document.getElementById("winBanner").classList.add("show");
    }
  }, 600);
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
  errors = 0;
  score = 0;
  matchedPairs = 0;
  document.getElementById("errors").innerText = 0;
  document.getElementById("score").innerText = 0;
  document.getElementById("timer").innerText = "0s";
  clearInterval(timerInterval);
  document.getElementById("winBanner").classList.remove("show");
  startGame();
}

function toggleMusic() {
  if (bgMusic.paused) {
    bgMusic.play();
  } else {
    bgMusic.pause();
  }
}

// 🟢 Play Again Button
document.getElementById("playAgainBtn").addEventListener("click", () => {
  document.getElementById("winBanner").classList.remove("show");
  restartGame();
});


