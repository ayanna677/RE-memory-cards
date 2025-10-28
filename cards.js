/* =========================
   FONT IMPORT
========================= */
@import url('https://fonts.googleapis.com/css2?family=Rubik+Bubbles&display=swap');

/* =========================
   GLOBAL STYLE
========================= */
body {
    background: url("./pokemon-bg.jpg") no-repeat center center fixed;
    background-size: cover;
    font-family: 'Rubik Bubbles', cursive;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    min-height: 100vh;
    margin: 0;
    color: #fff;
    text-align: center;
    text-shadow: 0 0 8px rgba(0, 0, 0, 0.9), 0 0 12px rgba(255, 255, 255, 0.6);
}

/* =========================
   HEADER & TITLES
========================= */
header {
    margin-top: 40px;
    text-shadow: 0 0 10px rgba(255, 255, 255, 0.6);
}

h1 {
    font-size: 3rem;
    font-weight: 700;
    letter-spacing: 2px;
    font-family: 'Rubik Bubbles', cursive;
    background: linear-gradient(90deg, #ffcc00, #ff8800, #ffee33, #ffcc00);
    background-size: 300%;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    animation: shimmer 4s infinite linear;
    text-shadow: 0 0 25px rgba(255, 200, 0, 0.9);
}

h2 {
    font-size: 1.6rem;
    color: #fff;
    font-family: 'Rubik Bubbles', cursive;
    text-shadow: 0 0 15px rgba(255, 255, 255, 0.8);
}

/* =========================
   STATS SECTION
========================= */
.stats {
    margin: 15px 0;
    font-size: 1.4rem;
    font-weight: 600;
    font-family: 'Rubik Bubbles', cursive;
    background: rgba(255, 255, 255, 0.12);
    padding: 12px 25px;
    border-radius: 15px;
    box-shadow: 0 0 25px rgba(255, 255, 255, 0.25);
    border: 2px solid rgba(255, 215, 0, 0.5);
    animation: glowPulse 2s infinite alternate;
}

.stats span {
    display: inline-block;
    margin: 0 12px;
    color: #ffea80;
    text-shadow: 0 0 10px #ffd700, 0 0 25px #ffb300, 0 0 40px #ff8800;
}

/* =========================
   BUTTONS
========================= */
.buttons {
    margin-bottom: 25px;
}

button {
    background: linear-gradient(90deg, #ffcc00, #ffaa00);
    border: none;
    padding: 12px 22px;
    margin: 0 6px;
    border-radius: 10px;
    font-size: 1.2rem;
    font-weight: 600;
    font-family: 'Rubik Bubbles', cursive;
    cursor: pointer;
    color: #000;
    box-shadow: 0 0 25px rgba(255, 200, 0, 0.9);
    transition: 0.3s ease;
    text-shadow: 0 0 5px rgba(255, 255, 255, 0.7);
}

button:hover {
    background: linear-gradient(90deg, #ffd84d, #ff9f00);
    transform: scale(1.1);
    box-shadow: 0 0 40px rgba(255, 220, 0, 1);
}

/* =========================
   BOARD & CARDS
========================= */
#board {
    display: grid;
    grid-template-columns: repeat(6, 100px);
    grid-template-rows: repeat(3, 140px);
    gap: 8px;
    background: rgba(255, 255, 255, 0.15);
    padding: 20px;
    border-radius: 20px;
    border: 3px solid rgba(255,255,255,0.4);
    box-shadow: 0 0 30px rgba(255, 220, 100, 0.7);
}

.card {
    width: 100px;
    height: 140px;
    border-radius: 12px;
    object-fit: cover;
    cursor: pointer;
    transition: transform 0.25s ease, box-shadow 0.35s ease;
    box-shadow: 0 0 15px rgba(255, 215, 0, 0.5);
}

.card:hover {
    transform: scale(1.08);
    box-shadow: 0 0 35px rgba(255, 230, 100, 0.9);
}

/* =========================
   WINNING BANNER
========================= */
#winBanner {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: radial-gradient(circle at center, rgba(255,215,0,0.2), rgba(0,0,0,0.9));
    color: #fff;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 2rem;
    z-index: 999;
    opacity: 0;
    visibility: hidden;
    transition: opacity 0.6s ease, visibility 0.6s ease;
}

#winBanner.show {
    opacity: 1;
    visibility: visible;
}

#winBanner .banner-content {
    background: rgba(255, 255, 255, 0.1);
    border: 3px solid #ffcc00;
    padding: 50px 70px;
    border-radius: 20px;
    text-shadow: 0 0 20px rgba(255, 255, 180, 1);
    box-shadow: 0 0 45px rgba(255, 220, 100, 0.9);
    animation: glowPulse 2s infinite alternate ease-in-out;
}

/* =========================
   START BANNER
========================= */
#startBanner {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.9);
    color: #fff;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 999;
    opacity: 1;
    visibility: visible;
    transition: opacity 0.6s ease, visibility 0.6s ease;
    animation: fadeIn 1s ease forwards;
}

#startBanner.hide {
    opacity: 0;
    visibility: hidden;
}

/* =========================
   SHARED BANNER STYLE
========================= */
.banner-content {
    background: rgba(255, 215, 0, 0.15);
    border: 3px solid #ffcc00;
    padding: 40px 60px;
    border-radius: 20px;
    text-align: center;
    box-shadow: 0 0 30px rgba(255, 215, 0, 0.9);
    transform: scale(0.95);
    animation: popIn 0.8s ease forwards;
    text-shadow: 0 0 12px rgba(255, 255, 255, 0.8);
}

.banner-content h2 {
    font-size: 2.4rem;
    font-family: 'Rubik Bubbles', cursive;
    background: linear-gradient(90deg, #ffcc00, #ffee66, #ff8800);
    background-size: 250%;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    font-weight: 700;
    margin-bottom: 10px;
    animation: shimmer 4s infinite linear;
}

.banner-content p {
    font-size: 1.2rem;
    margin-bottom: 20px;
    color: #ffecb3;
    text-shadow: 0 0 12px rgba(255, 255, 255, 0.7);
}

#startGameBtn, #playAgainBtn {
    background: linear-gradient(90deg, #ffcc00, #ffaa00);
    border: none;
    padding: 12px 28px;
    border-radius: 10px;
    font-size: 1.3rem;
    font-weight: 600;
    font-family: 'Rubik Bubbles', cursive;
    cursor: pointer;
    transition: 0.3s;
    color: #000;
    box-shadow: 0 0 35px rgba(255, 200, 0, 0.9);
}

#startGameBtn:hover, #playAgainBtn:hover {
    background: linear-gradient(90deg, #ffea33, #ff9900);
    transform: scale(1.1);
    box-shadow: 0 0 45px rgba(255, 220, 0, 1);
}

/* =========================
   ANIMATIONS
========================= */
@keyframes shimmer {
    0% { background-position: 0% 50%; }
    100% { background-position: 200% 50%; }
}

@keyframes glowPulse {
    0% { text-shadow: 0 0 10px #fff, 0 0 25px #ffcc00, 0 0 45px #ffaa00; }
    100% { text-shadow: 0 0 20px #fff6b0, 0 0 45px #ffd700, 0 0 65px #ff8800; }
}

@keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
}

@keyframes popIn {
    0% { transform: scale(0.7); opacity: 0; }
    100% { transform: scale(1); opacity: 1; }
}
