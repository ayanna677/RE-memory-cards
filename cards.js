let errors = 0;
let score = 0;
let time = 0;
let timerInterval;

let cardList = [
  "darkness",
  "double",
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
let board = [];
let rows = 4;
let columns = 5;
let card1 = null;
let card2 = null;

// Audio elements
const flipSound = document.getElementById("flipSound");
const matchSound = document.getElementById("matchSound");
const errorSound = document.getElementById("errorSound");
const winSound = document.getElementById("winSound");
const bgMusic = document.getElementById("bgMusic");

// Buttons
const startBtn = document.getElementById("startBtn");
const restartBtn = document.getElementById("restartBtn");
const musicToggle = document.getElementById("musicToggle");

startBtn.addEventListener("click", startGame);
restartBtn.addEventListener("click", restartGame);
musicToggle.addEventListener("click", toggleMusic);

function startGame() {
  // enable audio playback on user gesture
  flipSound.play().catch(() => {});
  flipSound.pause();

  startBtn.style.display = "none";
  restartBtn.style.display = "inline-block";

  resetStats();
  shuffleCards();
  createBoard();

  timerInterval = setInterval(() => {
    time++;
    document.getElementById("timer").innerText = time + "s";
  }, 1000);

  bgMusic.volume = 0.4;
  bgMusic.play().catch(() => {});
}

function restartGame() {
  clearInterval(timerInterval);
  document.getElementById("board").innerHTML = "";
  board = [];
  startGame();
}

function resetStats() {
  errors = 0;
  score = 0;
  time = 0;
  card1 = null;
  card2 = null;
  document.getElementById("errors").innerText = "0";
  document.getElementById("score").innerText = "0";
  document.getElementById("timer").innerText = "0s";
}

function shuffleCards() {
  cardSet = cardList.concat(cardList);
  for (let i = 0; i < cardSet.length; i++) {
    const j = Math.floor(Math.random() * cardSet.length);
    [cardSet[i], cardSet[j]] = [cardSet[j], cardSet[i]];
  }
}

function createBoard() {
  const boardContainer = document.getElementById("board");
  boardContainer.innerHTML = "";
  for (let r = 0; r < rows; r++) {
    board[r] = [];
    for (let c = 0; c < columns; c++) {
      const cardValue = cardSet.pop();
      board[r][c] = cardValue;

      const card = document.createElement("img");
      card.id = `${r}-${c}`;
      card.src = "images/back.jpg"; // ✅ fix path
      card.classList.add("card");
      card.addEventListener("click", selectCard);
      boardContainer.append(card);
    }
  }
}

function selectCard() {
  if (this.src.includes("back")) {
    flipSound.currentTime = 0;
    flipSound.play();

    if (!card1) {
      card1 = this;
      const [r, c] = this.id.split("-").map(Number);
      card1.src = "images/" + board[r][c] + ".jpg"; // ✅ fix path
    } else if (!card2 && this !== card1) {
      card2 = this;
      const [r, c] = this.id.split("-").map(Number);
      card2.src = "images/" + board[r][c] + ".jpg"; // ✅ fix path
      setTimeout(checkMatch, 700);
    }
  }
}

function checkMatch() {
  if (card1.src === card2.src) {
    matchSound.currentTime = 0;
    matchSound.play();
    score += 10;
    document.getElementById("score").innerText = score;
    card1 = null;
    card2 = null;

    if (score === cardList.length * 10) {
      clearInterval(timerInterval);
      bgMusic.pause();
      winSound.play();
      setTimeout(() => alert("🎉 You matched all cards! Great job!"), 400);
    }
  } else {
    errorSound.currentTime = 0;
    errorSound.play();
    card1.src = "images/back.jpg"; // ✅ fix path
    card2.src = "images/back.jpg"; // ✅ fix path
    errors++;
    document.getElementById("errors").innerText = errors;
    card1 = null;
    card2 = null;
  }
}

function toggleMusic() {
  if (bgMusic.paused) {
    bgMusic.play();
    musicToggle.textContent = "🔊";
  } else {
    bgMusic.pause();
    musicToggle.textContent = "🔇";
  }
}
