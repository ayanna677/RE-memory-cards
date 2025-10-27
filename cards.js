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
let board = [];
let rows = 4;
let columns = 4;
let card1 = null;
let card2 = null;
let matchedPairs = 0;

// Sound elements
const flipSound = new Audio("sounds/flip.mp3");
const matchSound = new Audio("sounds/match.mp3");
const errorSound = new Audio("sounds/error.mp3");
const winSound = new Audio("sounds/win.mp3");
const bgMusic = new Audio("sounds/bg-music.mp3");
bgMusic.loop = true;

document.getElementById("startBtn").addEventListener("click", startGame);
document.getElementById("restartBtn").addEventListener("click", restartGame);
document.getElementById("musicToggle").addEventListener("click", toggleMusic);

function shuffleCards() {
  cardSet = cardList.concat(cardList);
  for (let i = cardSet.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [cardSet[i], cardSet[j]] = [cardSet[j], cardSet[i]];
  }
}

function startGame() {
  document.getElementById("startBtn").style.display = "none";
  document.getElementById("restartBtn").disabled = false;

  shuffleCards();
  createBoard();
  startTimer();
  bgMusic.play();
}

function createBoard() {
  const boardDiv = document.getElementById("board");
  boardDiv.innerHTML = "";
  board = [];

  for (let r = 0; r < rows; r++) {
    let row = [];
    for (let c = 0; c < columns; c++) {
      if (cardSet.length === 0) break;
      const cardImg = cardSet.pop();

      // Create card wrapper
      const card = document.createElement("div");
      card.classList.add("card");
      card.dataset.value = cardImg;

      // Inner layer for 3D flip
      const inner = document.createElement("div");
      inner.classList.add("card-inner");

      // Front image (the actual symbol)
      const front = document.createElement("img");
      front.src = "images/" + cardImg + ".jpg";
      front.classList.add("card-front");

      // Back image
      const back = document.createElement("img");
      back.src = "images/back.jpg";
      back.classList.add("card-back");

      inner.appendChild(front);
      inner.appendChild(back);
      card.appendChild(inner);
      card.addEventListener("click", flipCard);
      boardDiv.appendChild(card);
      row.push(cardImg);
    }
    board.push(row);
  }
}

function flipCard() {
  // Prevent clicking more than 2 cards at once
  if (card1 && card2) return;

  // Flip animation
  if (!this.classList.contains("flipped")) {
    flipSound.play();
    this.classList.add("flipped");

    if (!card1) {
      card1 = this;
    } else if (!card2 && this !== card1) {
      card2 = this;

      document.querySelectorAll(".card").forEach(card => {
        card.style.pointerEvents = "none";
      });

      setTimeout(checkMatch, 1000);
    }
  }
}

function checkMatch() {
  if (card1.dataset.value === card2.dataset.value) {
    matchSound.play();
    score += 10;
    matchedPairs++;

    card1.style.pointerEvents = "none";
    card2.style.pointerEvents = "none";

    if (matchedPairs === (rows * columns) / 2) {
      clearInterval(timerInterval);
      winSound.play();
      setTimeout(() => {
        alert("🎉 You win! Total Score: " + score);
      }, 600);
    }
  } else {
    errorSound.play();
    errors++;
    document.getElementById("errors").innerText = errors;

    // Flip both cards back
    setTimeout(() => {
      card1.classList.remove("flipped");
      card2.classList.remove("flipped");
    }, 700);
  }

  setTimeout(() => {
    card1 = null;
    card2 = null;
    document.querySelectorAll(".card").forEach(card => {
      card.style.pointerEvents = "auto";
    });
    document.getElementById("score").innerText = score;
  }, 1100);
}

  // Win check
  if (matchedPairs === (rows * columns) / 2) {
    clearInterval(timerInterval);
    winSound.play();
    setTimeout(() => {
      alert("🎉 You win! Total Score: " + score);
    }, 400);
  }
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
  startGame();
}

function toggleMusic() {
  if (bgMusic.paused) {
    bgMusic.play();
  } else {
    bgMusic.pause();
  }
}

