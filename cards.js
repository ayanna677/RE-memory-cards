// =======================
// MEMORY CARD GAME SCRIPT
// =======================

let errors = 0,
  score = 0,
  time = 0,
  timerInterval,
  rows = 4,
  columns = 5,
  board = [],
  cardSet = [],
  card1 = null,
  card2 = null,
  matchedPairs = 0;

// 🎵 Preload sounds
const flipSound = new Audio("sounds/flip.mp3");
const matchSound = new Audio("sounds/match.mp3");
const errorSound = new Audio("sounds/error.mp3");
const winSound = new Audio("sounds/win.mp3");
[flipSound, matchSound, errorSound, winSound].forEach(s => s.load());

// =======================
// 🕹️ START GAME
// =======================
function startGame() {
  document.getElementById("startBanner").classList.remove("show");
  document.getElementById("winBanner").classList.remove("show");

  // Reset variables
  score = 0;
  errors = 0;
  time = 0;
  matchedPairs = 0;
  card1 = null;
  card2 = null;

  document.getElementById("score").innerText = score;
  document.getElementById("errors").innerText = errors;
  document.getElementById("time").innerText = time;

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
  board = [];

  // Generate card set
  let cardValues = [];
  for (let i = 1; i <= (rows * columns) / 2; i++) {
    cardValues.push(i, i);
  }

  cardValues = cardValues.sort(() => Math.random() - 0.5);
  cardSet = cardValues;

  // Create cards
  for (let i = 0; i < cardValues.length; i++) {
    const img = document.createElement("img");
    img.src = "images/back.jpg";
    img.dataset.value = cardValues[i];
    img.classList.add("card");
    img.addEventListener("click", flipCard, { once: false });
    gameBoard.appendChild(img);
  }
}

// =======================
// 🔄 FLIP CARD
// =======================
function flipCard(e) {
  e.preventDefault(); // Prevent touch+click double trigger

  const card = e.target;

  // Prevent flipping same or matched cards
  if (card.classList.contains("flipped") || card.classList.contains("matched")) return;

  flipSound.currentTime = 0;
  flipSound.play();

  card.src = `images/${card.dataset.value}.jpg`;
  card.classList.add("flipped");

  if (!card1) {
    card1 = card;
    return;
  }

  if (card1 === card) return;
  card2 = card;

  // Disable temporary clicks
  document.querySelectorAll(".card:not(.matched)").forEach(c => (c.style.pointerEvents = "none"));

  setTimeout(checkMatch, 600);
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

    setTimeout(() => {
      card1.src = "images/back.jpg";
      card2.src = "images/back.jpg";
      card1.classList.remove("flipped");
      card2.classList.remove("flipped");
    }, 400);
  }

  // Reset
  setTimeout(() => {
    card1 = null;
    card2 = null;
    document.querySelectorAll(".card:not(.matched)").forEach(c => (c.style.pointerEvents = "auto"));
    document.getElementById("score").innerText = score;

    // 🎉 Win condition
    if (matchedPairs === (rows * columns) / 2) {
      clearInterval(timerInterval);
      winSound.currentTime = 0;
      winSound.play();
      setTimeout(() => {
        document.getElementById("winBanner").classList.add("show");
      }, 600);
    }
  }, 500);
}

// =======================
// 🔁 RESTART GAME
// =======================
function restartGame() {
  clearInterval(timerInterval);
  startGame();
}

// =======================
// 🪩 SHOW START SCREEN ON LOAD
// =======================
window.addEventListener("load", () => {
  document.getElementById("startBanner").classList.add("show");
});
