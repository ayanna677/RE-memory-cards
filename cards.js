/* ==========================================================
   🧠 MEMORY CARD GAME — FINAL CLEAN FULL VERSION
   ========================================================== */

let errors = 0;
let score = 0;
let time = 0;
let timerInterval = null;

let rows = 4;
let columns = 5;

let card1 = null;
let card2 = null;
let matchedPairs = 0;

/* ==========================================================
   🎵 SOUND SETUP
   ========================================================== */

const flipSound  = new Audio("sounds/flip.mp3");
const matchSound = new Audio("sounds/match.mp3");
const errorSound = new Audio("sounds/error.mp3");
const winSound   = new Audio("sounds/win.mp3");

// Preload sounds on first interaction
document.addEventListener("click", () => {
  [flipSound, matchSound, errorSound, winSound].forEach(s => s.load());
}, { once: true });

/* ==========================================================
   🕹️ START GAME
   ========================================================== */
function startGame() {
  const startBanner = document.getElementById("startBanner");
  const winBanner   = document.getElementById("winBanner");

  // Hide banners
  startBanner.classList.remove("show");
  winBanner.classList.remove("show");
  startBanner.style.display = "none";
  winBanner.style.display = "none";

  // Reset stats
  errors = 0;
  score = 0;
  time = 0;
  matchedPairs = 0;
  card1 = null;
  card2 = null;

  // Update UI
  document.getElementById("score").innerText = score;
  document.getElementById("errors").innerText = errors;
  document.getElementById("timer").innerText = `${time}s`;

  // Start timer
  clearInterval(timerInterval);
  timerInterval = setInterval(() => {
    time++;
    document.getElementById("timer").innerText = `${time}s`;
  }, 1000);

  // Enable Restart button
  const restartBtn = document.getElementById("restartBtn");
  if (restartBtn) restartBtn.disabled = false;

  // Create game board
  createBoard();
}

/* ==========================================================
   🎴 CREATE BOARD
   ========================================================== */
function createBoard() {
  const board = document.getElementById("board");
  board.innerHTML = "";

  // Create paired card values
  let cardValues = [];
  for (let i = 1; i <= (rows * columns) / 2; i++) {
    cardValues.push(i, i);
  }

  // Shuffle cards
  cardValues.sort(() => Math.random() - 0.5);

  // Generate card elements
  cardValues.forEach(value => {
    const img = document.createElement("img");
    img.src = "images/back.jpg";
    img.dataset.value = value;
    img.classList.add("card");
    img.addEventListener("click", flipCard);
    board.appendChild(img);
  });
}

/* ==========================================================
   🔄 FLIP CARD
   ========================================================== */
function flipCard(e) {
  const card = e.target;

  // Prevent flipping matched or already flipped cards
  if (card.classList.contains("flipped") || card.classList.contains("matched")) return;

  // Play flip sound
  flipSound.currentTime = 0;
  flipSound.play();

  // Flip visual
  card.src = `images/${card.dataset.value}.jpg`;
  card.classList.add("flipped");

  // First card logic
  if (!card1) {
    card1 = card;
    return;
  }

  // Prevent double click on same card
  if (card === card1) return;

  // Second card selected
  card2 = card;

  // Temporarily disable clicks
  document.querySelectorAll(".card:not(.matched)").forEach(c => c.style.pointerEvents = "none");

  // Check for match after short delay
  setTimeout(checkMatch, 600);
}

/* ==========================================================
   ✅ CHECK MATCH
   ========================================================== */
function checkMatch() {
  if (!card1 || !card2) return;

  if (card1.dataset.value === card2.dataset.value) {
    // ✅ Match found
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

    // Flip back after delay
    setTimeout(() => {
      card1.src = "images/back.jpg";
      card2.src = "images/back.jpg";
      card1.classList.remove("flipped");
      card2.classList.remove("flipped");
    }, 400);
  }

  // Reset and re-enable clicks
  setTimeout(() => {
    card1 = null;
    card2 = null;
    document.querySelectorAll(".card:not(.matched)").forEach(c => c.style.pointerEvents = "auto");
    document.getElementById("score").innerText = score;

    // 🎉 Win condition
    if (matchedPairs === (rows * columns) / 2) endGame();
  }, 600);
}

/* ==========================================================
   🏁 END GAME
   ========================================================== */
function endGame() {
  clearInterval(timerInterval);

  // Play win sound
  winSound.currentTime = 0;
  winSound.play();

  // Show win banner
  setTimeout(() => {
    const winBanner = document.getElementById("winBanner");
    winBanner.classList.add("show");
    winBanner.style.display = "flex";
  }, 600);
}

/* ==========================================================
   🔁 RESTART GAME
   ========================================================== */
function restartGame() {
  clearInterval(timerInterval);
  startGame();
}

/* ==========================================================
   🚀 INITIALIZE ON LOAD
   ========================================================== */
window.addEventListener("load", () => {
  const banner = document.getElementById("startBanner");
  banner.classList.add("show");
  banner.style.display = "flex";
});

/* ==========================================================
   🎮 BUTTON EVENT LISTENERS
   ========================================================== */
document.addEventListener("DOMContentLoaded", () => {
  const startBtn = document.getElementById("startGameBtn");
  const playAgainBtn = document.getElementById("playAgainBtn");
  const restartBtn = document.getElementById("restartBtn");

  if (startBtn) startBtn.addEventListener("click", startGame);
  if (playAgainBtn) playAgainBtn.addEventListener("click", () => {
    document.getElementById("winBanner").classList.remove("show");
    startGame();
  });
  if (restartBtn) restartBtn.addEventListener("click", restartGame);
});
