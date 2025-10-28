let errors = 0, score = 0, time = 0, timerInterval;
let rows = 4, columns = 5;
let card1 = null, card2 = null, matchedPairs = 0;

// 🔊 Sounds
const flipSound  = new Audio("flip.mp3");
const matchSound = new Audio("match.mp3");
const errorSound = new Audio("error.mp3");
const winSound   = new Audio("win.mp3");

// preload once on first click
document.addEventListener("click", () => {
  [flipSound, matchSound, errorSound, winSound].forEach(s => s.load());
}, { once: true });

// 🟢 start game
function startGame() {
  document.getElementById("startBanner").style.display = "none";
  document.getElementById("winBanner").style.display = "none";

  errors = score = time = matchedPairs = 0;
  card1 = card2 = null;

  document.getElementById("score").innerText = 0;
  document.getElementById("errors").innerText = 0;
  document.getElementById("timer").innerText = "0s";

  clearInterval(timerInterval);
  timerInterval = setInterval(() => {
    time++;
    document.getElementById("timer").innerText = `${time}s`;
  }, 1000);

  document.getElementById("restartBtn").disabled = false;
  createBoard();
}

// 🧩 create board
function createBoard() {
  const board = document.getElementById("board");
  board.innerHTML = "";

  const values = [];
  for (let i = 1; i <= (rows * columns) / 2; i++) values.push(i, i);
  values.sort(() => Math.random() - 0.5);

  values.forEach(v => {
    const img = document.createElement("img");
    img.src = "back.jpg";
    img.dataset.value = v;
    img.classList.add("card");
    img.addEventListener("click", flipCard);
    board.appendChild(img);
  });
}

// 🌀 flip logic
function flipCard(e) {
  const card = e.target;
  if (card.classList.contains("flipped") || card.classList.contains("matched")) return;

  flipSound.currentTime = 0;
  flipSound.play();

  card.src = `${card.dataset.value}.jpg`;
  card.classList.add("flipped");

  if (!card1) { card1 = card; return; }
  if (card === card1) return; // same card click

  card2 = card;
  document.querySelectorAll(".card:not(.matched)").forEach(c => c.style.pointerEvents = "none");

  setTimeout(checkMatch, 700);
}

// 🔍 check match
function checkMatch() {
  if (!card1 || !card2) return;

  if (card1.dataset.value === card2.dataset.value) {
    // ✅ match
    matchSound.currentTime = 0;
    matchSound.play();

    score += 10;
    matchedPairs++;
    card1.classList.add("matched");
    card2.classList.add("matched");
  } else {
    // ❌ no match
    errorSound.currentTime = 0;
    errorSound.play();
    errors++;

    document.getElementById("errors").innerText = errors;

    // flip back both
    setTimeout(() => {
      card1.src = "back.jpg";  // make sure this file exists
      card2.src = "back.jpg";
      card1.classList.remove("flipped");
      card2.classList.remove("flipped");
    }, 600);
  }

  setTimeout(() => {
    card1 = card2 = null;
    document.querySelectorAll(".card:not(.matched)").forEach(c => c.style.pointerEvents = "auto");
    document.getElementById("score").innerText = score;
    if (matchedPairs === (rows * columns) / 2) endGame();
  }, 800);
}

// 🏁 end game
function endGame() {
  clearInterval(timerInterval);
  winSound.currentTime = 0;
  winSound.play();
  setTimeout(() => {
    const winBanner = document.getElementById("winBanner");
    winBanner.style.display = "flex";
  }, 700);
}

// 🔁 restart
function restartGame() {
  clearInterval(timerInterval);
  startGame();
}

// 🚀 init
window.addEventListener("load", () => {
  document.getElementById("startBanner").style.display = "flex";
});

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("startGameBtn").addEventListener("click", startGame);
  document.getElementById("playAgainBtn").addEventListener("click", startGame);
  document.getElementById("restartBtn").addEventListener("click", restartGame);
});
