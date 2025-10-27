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

      const card = document.createElement("img");
      card.src = "images/back.jpg";
      card.dataset.value = cardImg;
      card.classList.add("card");
      card.addEventListener("click", flipCard);
      boardDiv.appendChild(card);
      row.push(cardImg);
    }
    board.push(row);
  }
}

function flipCard() {
  if (card1 && card2) return;

  const currentSrc = this.src.split("/").pop();

  if (currentSrc === "back.jpg") {
    flipSound.play();
    this.src = "images/" + this.dataset.value + ".jpg";

    if (!card1) {
      card1 = this;
    } else if (!card2 && this !== card1) {
      card2 = this;

      // Disable all clicks while checking
      document.querySelectorAll(".card").forEach(card => {
        card.style.pointerEvents = "none";
      });

      setTimeout(checkMatch, 700);
    }
  }
}

function checkMatch() {
  if (card1.dataset.value === card2.dataset.value) {
    matchSound.play();
    score += 10;
    matchedPairs++;

    // Keep matched cards open
    card1.style.pointerEvents = "none";
    card2.style.pointerEvents = "none";
  } else {
    errorSound.play();
    errors++;
    document.getElementById("errors").innerText = errors;

    // Flip them back after delay
    setTimeout(() => {
      card1.src = "images/back.jpg";
      card2.src = "images/back.jpg";
    }, 500);
  }

  setTimeout(() => {
    card1 = null;
    card2 = null;
    document.getElementById("score").innerText = score;
    document.querySelectorAll(".card").forEach(card => {
      if (card.src.includes("back.jpg")) card.style.pointerEvents = "auto";
    });
  }, 800);

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
