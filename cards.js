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
  // Don’t allow clicking if two cards are already flipped
  if (card1 && card2) return;

  // Get only the file name part (ignore full URL)
  const currentSrc = this.src.split("/").pop();

  // Flip only if it's showing the back
  if (currentSrc === "back.jpg") {
    flipSound.play();
    this.src = "images/" + this.dataset.value + ".jpg";

    if (!card1) {
      card1 = this;
    } else if (!card2 && this !== card1) {
      card2 = this;

      // Disable clicks temporarily during comparison
      document.querySelectorAll(".card").forEach(card => {
        card.style.pointerEvents = "none";
      });

      setTimeout(checkMatch, 800);
    }
  }
}

function checkMatch() {
  if (card1.dataset.value === card2.dataset.value) {
    // ✅ Correct match
    matchSound.play();
    score += 10;
    matchedPairs++;

    // Leave them open, but prevent re-clicking
    card1.style.pointerEvents = "none";
    card2.style.pointerEvents = "none";

    // Check for win
    if (matchedPairs === (rows * columns) / 2) {
      clearInterval(timerInterval);
      winSound.play();
      setTimeout(() => {
        alert("🎉 You win! Total Score: " + score);
      }, 500);
    }
  } else {
    // ❌ Wrong match
    errorSound.play();
    errors++;
    document.getElementById("errors").innerText = errors;

    // Flip both cards back after a short delay
    setTimeout(() => {
      card1.src = "images/back.jpg";
      card2.src = "images/back.jpg";
    }, 600);
  }

  // Reset selections and re-enable clicks
  setTimeout(() => {
    card1 = null;
    card2 = null;
    document.querySelectorAll(".card").forEach(card => {
      card.style.pointerEvents = "auto";
    });
    document.getElementById("score").innerText = score;
  }, 900);
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


