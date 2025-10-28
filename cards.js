/* cards.js — improved, robust, preloaded, debounced version */

/* ---------- CONFIG ---------- */
let errors = 0;
let score = 0;
let time = 0;
let timerInterval = null;
let flipTimeout = null;
let resetTimeout = null;

const cardList = [
  "darkness","fairy","fighting","fire","grass","lightning","metal","psychic","water"
];

let cardSet = [];
const rows = 3;
const columns = 6;
let card1 = null;
let card2 = null;
let matchedPairs = 0;
let boardLocked = false;        // prevents clicks while checking
let gameStarted = false;        // prevents starting twice

/* ---------- SOUNDS (preload) ---------- */
const flipSound = new Audio("sounds/flip.mp3");
const matchSound = new Audio("sounds/match.mp3");
const errorSound = new Audio("sounds/error.mp3");
const winSound = new Audio("sounds/win.mp3");
const bgMusic = new Audio("sounds/bg-music.mp3");
bgMusic.loop = true;

/* Safari/Chrome autoplay policies may block play() until user interaction.
   We still call play after Start click. */

/* ---------- DOM LISTENERS / ELEMENTS ---------- */
const restartBtn = document.getElementById("restartBtn");
const musicToggle = document.getElementById("musicToggle");
const startGameBtn = document.getElementById("startGameBtn");
const playAgainBtn = document.getElementById("playAgainBtn");
const startBanner = document.getElementById("startBanner");
const winBanner = document.getElementById("winBanner");
const boardDiv = document.getElementById("board");

restartBtn.addEventListener("click", restartGame);
musicToggle.addEventListener("click", toggleMusic);
startGameBtn.addEventListener("click", onStartClicked);
playAgainBtn.addEventListener("click", onPlayAgainClicked);

/* ---------- PRELOAD IMAGES & SOUNDS ---------- */
function preloadAssets() {
  // preload front images + back
  const toLoad = new Set();
  toLoad.add("images/back.jpg");
  cardList.forEach(name => toLoad.add(`images/${name}.jpg`));

  const promises = [...toLoad].map(src => {
    return new Promise(resolve => {
      const img = new Image();
      img.src = src;
      if (img.complete) return resolve();
      img.onload = () => resolve();
      img.onerror = () => resolve(); // resolve even on error to avoid hanging
    });
  });

  // also warm-up sounds (some browsers won't allow full decode until interaction)
  const soundPromises = [flipSound, matchSound, errorSound, winSound, bgMusic].map(s => {
    return new Promise(resolve => {
      // try to decode (may fail silently in some browsers until interaction)
      if (s.readyState >= 2) return resolve();
      s.addEventListener("canplaythrough", function onCan() {
        s.removeEventListener("canplaythrough", onCan);
        resolve();
      });
      // fallback: resolve after small delay
      setTimeout(resolve, 1000);
    });
  });

  return Promise.all([...promises, ...soundPromises]);
}

/* ---------- UTILITIES ---------- */
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

/* ---------- GAME FLOW ---------- */
function onStartClicked() {
  // prevent double-clicks on the start button
  if (gameStarted) return;
  gameStarted = true;
  startGameBtn.disabled = true;

  // hide banner with its CSS transition; start game after fade
  startBanner.classList.add("hide");

  // ensure assets are preloaded before building board for smoothness
  preloadAssets().then(() => {
    // small delay to allow banner hide transition
    setTimeout(() => {
      startGame();
    }, 400);
  });
}

function startGame() {
  restartBtn.disabled = false;
  matchedPairs = 0;
  card1 = null;
  card2 = null;
  errors = 0;
  score = 0;
  updateUI();

  // play bg music (user already clicked Start, so play should be allowed)
  bgMusic.play().catch(() => { /* ignore play errors */ });

  // prepare cardSet and board
  shuffleCards();
  createBoardFast();
  startTimer();
}

/* ---------- SHUFFLE & BOARD ---------- */
function shuffleCards() {
  // create duplicated set (2 of each)
  cardSet = cardList.concat(cardList);
  shuffle(cardSet);
}

function createBoardFast() {
  // Clear pending timeouts (safety)
  if (flipTimeout) { clearTimeout(flipTimeout); flipTimeout = null; }
  if (resetTimeout) { clearTimeout(resetTimeout); resetTimeout = null; }

  // Clear board quickly using fragment for performance
  boardDiv.innerHTML = "";
  const frag = document.createDocumentFragment();

  // ensure we have exactly rows * columns items (cardSet length should match)
  const total = rows * columns;
  // In case cardSet length < total (shouldn't happen), fill with duplicates from start
  while (cardSet.length < total) {
    cardSet.push(...cardList); // fallback
  }

  for (let i = 0; i < total; i++) {
    const cardName = cardSet[i];

    const img = document.createElement("img");
    img.classList.add("card");
    img.dataset.value = cardName;
    img.src = "images/back.jpg"; // start with back
    img.alt = cardName;
    img.draggable = false;
    // click handler
    img.addEventListener("click", flipCard);
    frag.appendChild(img);
  }

  boardDiv.appendChild(frag);

  // Ensure pointer events active after building
  document.querySelectorAll(".card").forEach(c => c.style.pointerEvents = "auto");
}

/* ---------- FLIP + MATCH LOGIC ---------- */
function flipCard(e) {
  if (boardLocked) return;             // global lock while checking
  const el = e.currentTarget;

  // prevent flipping an already matched (we mark matched by disabling pointerEvents)
  if (el.style.pointerEvents === "none") return;

  // get current filename only for robust comparison
  const currentSrc = el.src.split("/").pop();
  if (currentSrc !== "back.jpg") return; // already open

  // instant set image (preloaded ensures immediate)
  flipSound.currentTime = 0;
  flipSound.play().catch(() => {});

  el.src = "images/" + el.dataset.value + ".jpg";

  if (!card1) {
    card1 = el;
    return;
  }

  if (el === card1) return; // clicked same card twice

  card2 = el;

  // lock the board until we check
  boardLocked = true;
  // temporarily block clicks on other cards
  document.querySelectorAll(".card").forEach(c => { c.style.pointerEvents = "none"; });

  // check match after small visual delay
  flipTimeout = setTimeout(() => {
    checkMatchImmediate();
  }, 350); // short delay so open feels responsive
}

function checkMatchImmediate() {
  if (!card1 || !card2) {
    unlockBoard();
    return;
  }

  const isMatch = card1.dataset.value === card2.dataset.value;
  if (isMatch) {
    // matched
    matchSound.currentTime = 0;
    matchSound.play().catch(() => {});
    score += 10;
    matchedPairs++;

    // keep matched visible and disable further clicks on them
    card1.style.pointerEvents = "none";
    card2.style.pointerEvents = "none";

    // visual progress is immediate; unlock board
    unlockBoard();

    // check win
    if (matchedPairs === (rows * columns) / 2) {
      // small delay to let the last match sound play
      clearInterval(timerInterval);
      winSound.currentTime = 0;
      winSound.play().catch(() => {});
      // show banner after a short pause
      resetTimeout = setTimeout(() => {
        winBanner.classList.add("show");
        // disable all cards
        document.querySelectorAll(".card").forEach(c => c.style.pointerEvents = "none");
      }, 300);
    }
  } else {
    // not a match — play error and flip back after a visible delay
    errorSound.currentTime = 0;
    errorSound.play().catch(() => {});
    errors++;
    updateUI();

    resetTimeout = setTimeout(() => {
      // flip back
      if (card1) card1.src = "images/back.jpg";
      if (card2) card2.src = "images/back.jpg";
      unlockBoard();
    }, 600);
  }

  updateUI();
}

function unlockBoard() {
  // clear any existing lock timers
  boardLocked = false;
  // enable pointer events on cards that are not matched (back or open but not matched)
  document.querySelectorAll(".card").forEach(c => {
    // if card shows back or is unmatched front, and pointerEvents not 'none' as matched
    if (c.style.pointerEvents !== "none") c.style.pointerEvents = "auto";
  });
  card1 = null;
  card2 = null;
}

/* ---------- UI / TIMER / RESTART ---------- */
function startTimer() {
  time = 0;
  document.getElementById("timer").innerText = "0s";
  clearInterval(timerInterval);
  timerInterval = setInterval(() => {
    time++;
    document.getElementById("timer").innerText = time + "s";
  }, 1000);
}

function updateUI() {
  document.getElementById("errors").innerText = errors;
  document.getElementById("score").innerText = score;
}

function restartGame() {
  // clear timers and timeouts
  if (flipTimeout) { clearTimeout(flipTimeout); flipTimeout = null; }
  if (resetTimeout) { clearTimeout(resetTimeout); resetTimeout = null; }
  clearInterval(timerInterval);

  // hide banners
  winBanner.classList.remove("show");

  // reset state
  errors = 0;
  score = 0;
  matchedPairs = 0;
  card1 = null;
  card2 = null;
  boardLocked = false;
  gameStarted = false;
  startGameBtn.disabled = false;

  updateUI();
  // show start banner again
  startBanner.classList.remove("hide");
  // pause bgMusic
  try { bgMusic.pause(); bgMusic.currentTime = 0; } catch (e) {}
}

/* ---------- PLAY AGAIN ---------- */
function onPlayAgainClicked() {
  winBanner.classList.remove("show");
  // small delay to allow banner hide animation before restart
  setTimeout(() => restartGame(), 200);
}

/* ---------- MUSIC TOGGLE ---------- */
function toggleMusic() {
  if (bgMusic.paused) {
    bgMusic.play().catch(() => {});
  } else {
    bgMusic.pause();
  }
}

/* ---------- SAFETY: ensure board cleared if user refreshes etc. ---------- */
window.addEventListener("beforeunload", () => {
  // stop music & clear timers
  try { bgMusic.pause(); } catch (e) {}
  clearInterval(timerInterval);
  if (flipTimeout) clearTimeout(flipTimeout);
  if (resetTimeout) clearTimeout(resetTimeout);
});
