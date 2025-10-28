/* ==========================================================
   🧠 MEMORY CARD GAME — Polished & Optimized JS
   ========================================================== */

let errors = 0, score = 0, time = 0, timerInterval = null;
let rows = 4, columns = 5;
let card1 = null, card2 = null, matchedPairs = 0;
let isChecking = false;

/* ==========================================================
   🎵 SOUND SETUP
   ========================================================== */
const flipSound  = new Audio("sounds/flip.mp3");
const matchSound = new Audio("sounds/match.mp3");
const errorSound = new Audio("sounds/error.mp3");
const winSound   = new Audio("sounds/win.mp3");

// Preload all sounds once user interacts (fixes autoplay issues)
document.addEventListener("click", () => {
  [flipSound, matchSound, errorSound, winSound].forEach(s => s.load());
}, { once: true });

/* ==========================================================
   🕹️ START GAME
   ========================================================== */
function startGame() {
  const startBanner = document.getElementById("startBanner");
  const winBanner   = document.getElementById("winBanner");

  startBanner.style.display = "none";
  winBanner.style.display = "none";
  startBanner.classList.remove("show");
  winBanner.classList.remove("show");

  // Reset variables
  errors = 0; score = 0; time = 0; matchedPairs = 0;
  card1 = null; card2 = null; isChecking = false;

  document.getElementById("score").innerText = score;
  document.getElementById("errors").innerText = errors;
  document.getElementById("time").innerText = time;

  clearInterval(timerInterval);
  timerInterval = setInterval(() => {
    time++;
    document.getElementById("time").innerText = time;
  }, 1000);

  createBoard();
}

/* ==========================================================
   🎴 CREATE BOARD
   ========================================================== */
function createBoard() {
  const board = document.getElementById("gameBoard");
  board.innerHTML = "";

  // Create & shuffle card values
  let cardValues = [];
  for (let i = 1; i <= (rows * columns) / 2; i++) cardValues.push(i, i);
  cardValues.sort(() => Math.random() - 0.5);

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
  if (isChecking) return; // prevent flipping while checking
  const card = e.target;
  if (card.classList.contains("flipped") || card.classList.contains("matched")) return;

  flipSound.currentTime = 0;
  flipSound.play();

  card.src = `images/${card.dataset.value}.jpg`;
  card.classList.add("flipped");

  if (!card1) {
    card1 = card;
    return;
  }

  if (card === card1) return;

  card2 = card;
  isChecking = true;

  setTimeout(checkMatch, 600);
}

/* ==========================================================
   ✅ CHECK MATCH
   ========================================================== */
function checkMatch() {
  if (!card1 || !card2) return;

  if (card1.dataset.value === card2.dataset.value) {
    // Match
    matchSound.currentTime = 0;
    matchSound.play();

    card1.classList.add("matched");
    card2.classList.add("matched");

    score += 10;
    matchedPairs++;
    document.getElementById("score").innerText = score;

    resetFlipState();
  } else {
    // Not a match
    errorSound.currentTime = 0;
    errorSound.play();
    errors++;
    document.getElementById("errors").innerText = errors;

    setTimeout(() => {
      card1.src = "images/back.jpg";
      card2.src = "images/back.jpg";
      card1.classList.remove("flipped");
      card2.classList.remove("flipped");
      resetFlipState();
    }, 600);
  }
}

/* ==========================================================
   ♻️ RESET FLIP STATE
   ========================================================== */
function resetFlipState() {
  card1 = null;
  card2 = null;
  isChecking = false;

  if (matchedPairs === (rows * columns) / 2) {
    setTimeout(endGame, 500);
  }
}

/* ==========================================================
   🏁 END GAME
   ========================================================== */
function endGame() {
  clearInterval(timerInterval);
  winSound.currentTime = 0;
  winSound.play();

  const winBanner = document.getElementById("winBanner");
  winBanner.style.display = "flex";
  winBanner.classList.add("show");
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
  banner.style.display = "flex";
  banner.classList.add("show");
});
