// =====================
// 🌟 POKÉMON CARDS MATCH GAME LOGIC
// =====================

let errors = 0;
let score = 0;
let time = 0;
let timerInterval;
let gameStarted = false;

const rows = 4;
const columns = 5;
let board = [];
let cardSet;
let card1Selected;
let card2Selected;

const cardList = [
  "darkness", "double", "fairy", "fighting", "fire",
  "grass", "lightning", "metal", "psychic", "water"
];

// 🎵 Sounds
const flipSound = document.getElementById("flipSound");
const matchSound = document.getElementById("matchSound");
const winSound = document.getElementById("winSound");

// 🕹️ Buttons and Stats
const startBtn = document.getElementById("startBtn");
const restartBtn = document.getElementById("restartBtn");
const timerEl = document.getElementById("timer");
const errorsEl = document.getElementById("errors");
const scoreEl = document.getElementById("score");

// =====================
// 🎮 Event Listeners
// =====================
startBtn.addEventListener("click", () => {
  startBtn.disabled = true;
  restartBtn.disabled = false;
  resetGame();
  startGame();
});

restartBtn.addEventListener("click", () => {
  resetGame();
  startGame();
});

// =====================
// ♻️ Reset Game
// =====================
function resetGame() {
  clearInterval(timerInterval);
  document.getElementById("board").innerHTML = "";
  board = [];
  errors = 0;
  score = 0;
  time = 0;
  errorsEl.innerText = errors;
  scoreEl.innerText = score;
  timerEl.innerText = `${time}s`;
  card1Selected = null;
  card2Selected = null;
  shuffleCards();
}

// =====================
// 🔀 Shuffle Cards
// =====================
function shuffleCards() {
  cardSet = cardList.concat(cardList); // duplicate each
  for (let i = 0; i < cardSet.length; i++) {
    const j = Math.floor(Math.random() * cardSet.length);
    [cardSet[i], cardSet[j]] = [cardSet[j], cardSet[i]];
  }
}

// =====================
// 🚀 Start Game
// =====================
function startGame() {
  let boardDiv = document.getElementById("board");
  boardDiv.innerHTML = "";
  for (let r = 0; r < rows; r++) {
    let row = [];
    for (let c = 0; c < columns; c++) {
      let cardImg = cardSet.pop();
      row.push(cardImg);

      let card = document.createElement("img");
      card.id = `${r}-${c}`;
      card.src = "back.jpg";
      card.classList.add("card");
      card.addEventListener("click", selectCard);
      boardDiv.append(card);
    }
    board.push(row);
  }

  startTimer();
}

// =====================
// ⏰ Timer
// =====================
function startTimer() {
  timerInterval = setInterval(() => {
    time++;
    timerEl.innerText = `${time}s`;
  }, 1000);
}

// =====================
// 🃏 Select Card
// =====================
function selectCard() {
  if (!gameStarted) gameStarted = true;

  if (this.src.includes("back")) {
    flipSound.play();

    if (!card1Selected) {
      card1Selected = this;
      revealCard(card1Selected);
    } else if (!card2Selected && this !== card1Selected) {
      card2Selected = this;
      revealCard(card2Selected);
      setTimeout(checkMatch, 800);
    }
  }
}

// =====================
// 🔍 Reveal Card
// =====================
function revealCard(card) {
  const [r, c] = card.id.split("-").map(Number);
  card.src = board[r][c] + ".jpg";
}

// =====================
// ✅ Check Match
// =====================
function checkMatch() {
  if (card1Selected.src === card2Selected.src) {
    matchSound.play();
    score += 10;
    scoreEl.innerText = score;

    // Disable click for matched cards
    card1Selected.removeEventListener("click", selectCard);
    card2Selected.removeEventListener("click", selectCard);

    card1Selected.classList.add("matched");
    card2Selected.classList.add("matched");

    checkWin();
  } else {
    errors++;
    errorsEl.innerText = errors;

    setTimeout(() => {
      card1Selected.src = "back.jpg";
      card2Selected.src = "back.jpg";
    }, 600);
  }

  card1Selected = null;
  card2Selected = null;
}

// =====================
// 🏆 Check for Win
// =====================
function checkWin() {
  const allCards = document.querySelectorAll(".card");
  const flipped = [...allCards].filter(card => card.classList.contains("matched"));
  if (flipped.length === allCards.length) {
    clearInterval(timerInterval);
    winSound.play();
    setTimeout(() => {
      alert(`🎉 You Win!\n⏱ Time: ${time}s\n❌ Errors: ${errors}\n⭐ Score: ${score}`);
    }, 500);
  }
}
