const video = document.getElementById("video");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const resultDiv = document.getElementById("result");
const winnerDiv = document.getElementById("winner");
const startBtn = document.getElementById("start");
const nextRoundBtn = document.getElementById("nextround");
const playAgainBtn = document.getElementById("playagain");
const scoreDiv = document.getElementById("score");
const roundDiv = document.getElementById("round");

let gameActive = false;
let countdown = 3;
let countdownInterval = null;
let userMove = null;
let computerMove = null;
let userScore = 0;
let computerScore = 0;
let round = 0;
let cameraStarted = false;

const moves = ["rock", "paper", "scissors"];
const emojis = { rock: "✊", paper: "✋", scissors: "✌️" };

function updateScoreDisplay() {
  scoreDiv.innerHTML = `Score &nbsp; You: <b>${userScore}</b> | Computer: <b>${computerScore}</b>`;
}
function updateRoundDisplay() {
  roundDiv.innerHTML = `Round <b>${round}</b> (First to 3 wins)`;
}

function decideWinner(user, computer) {
  if (user === computer) return { result: "Tie!", winner: null };
  if (
    (user === "rock" && computer === "scissors") ||
    (user === "paper" && computer === "rock") ||
    (user === "scissors" && computer === "paper")
  )
    return { result: "You win this round!", winner: "user" };
  return { result: "Computer wins this round!", winner: "computer" };
}

function detectGesture(landmarks, handedness) {
  if (!landmarks) return null;
  const tipIds = [4, 8, 12, 16, 20];
  let fingers = [];
  // Thumb detection: adjust for left/right hand
  if (handedness === "Right") {
    // Right hand: thumb tip is to the left of the IP joint
    fingers.push(landmarks[4].x < landmarks[3].x ? 1 : 0);
  } else {
    // Left hand: thumb tip is to the right of the IP joint
    fingers.push(landmarks[4].x > landmarks[3].x ? 1 : 0);
  }
  // Other fingers (same for both hands)
  for (let i = 1; i < 5; i++) {
    fingers.push(landmarks[tipIds[i]].y < landmarks[tipIds[i] - 2].y ? 1 : 0);
  }
  const total = fingers.reduce((a, b) => a + b, 0);
  if (total === 0) return "rock";
  if (total === 2 && fingers[1] && fingers[2]) return "scissors";
  if (total === 5) return "paper";
  return null;
}


const hands = new Hands({
  locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`
});


hands.setOptions({
  maxNumHands: 1,
  modelComplexity: 1,
  minDetectionConfidence: 0.7,
  minTrackingConfidence: 0.7,
});

hands.onResults((results) => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  if (results.multiHandLandmarks?.length > 0) {
    for (let i = 0; i < results.multiHandLandmarks.length; i++) {
      const landmarks = results.multiHandLandmarks[i];
      const handedness = results.multiHandedness && results.multiHandedness[i]
        ? results.multiHandedness[i].label
        : "Right"; // default fallback
      drawConnectors(ctx, landmarks, HAND_CONNECTIONS, {
        color: "#008cff",
        lineWidth: 2,
      });
      drawLandmarks(ctx, landmarks, { color: "#fff", lineWidth: 2, radius: 3 });
      if (gameActive && countdown === 0 && !userMove) {
        userMove = detectGesture(landmarks, handedness);
      }
    }
  }
});


async function setupCamera() {
  if (cameraStarted) return;
  const stream = await navigator.mediaDevices.getUserMedia({ video: true });
  video.srcObject = stream;
  cameraStarted = true;
  return new Promise((resolve) => (video.onloadedmetadata = resolve));
}

function checkGameOver() {
  if (userScore >= 3 || computerScore >= 3) {
    const finalWinner =
      userScore >= 3
        ? "🎉 <b>You Won the Game!</b> 🎉"
        : "😢 <b>Computer Won the Game!</b> 😢";
    winnerDiv.innerHTML = `<h2>${finalWinner}</h2>`;
    playAgainBtn.style.display = "";
    startBtn.style.display = "none";
    nextRoundBtn.style.display = "none";
    gameActive = false;
    resultDiv.textContent = "Thanks for playing !!!";
    roundDiv.textContent = "";
    return true;
  }
  return false;
}

function startCountdown() {
  if (checkGameOver()) return;
  countdown = 3;
  round++;
  userMove = null;
  computerMove = null;
  gameActive = true;
  updateScoreDisplay();
  updateRoundDisplay();
  resultDiv.textContent = `Round ${round} - Get Ready...`;
  winnerDiv.textContent = "";
  nextRoundBtn.style.display = "none";
  playAgainBtn.style.display = "none";
  countdownInterval = setInterval(() => {
    if (countdown > 0) {
      resultDiv.textContent = `Round ${round} - Show your move: ${countdown}`;
      countdown--;
    } else {
      clearInterval(countdownInterval);
      resultDiv.textContent = "Detecting...";
      setTimeout(() => {
        let roundEnded = false;
        if (userMove) {
          computerMove = moves[Math.floor(Math.random() * 3)];
          const { result, winner } = decideWinner(userMove, computerMove);
          if (winner === "user") userScore++;
          if (winner === "computer") computerScore++;
          resultDiv.innerHTML = `
  <span class="move-text">You: ${emojis[userMove]}</span>
  
  <span class="move-text">Computer: ${emojis[computerMove]}</span><br>
  <b class="result-text">${result}</b>
`;

          updateScoreDisplay();
          updateRoundDisplay();
          roundEnded = true;
        } else {
          resultDiv.textContent = "No valid move detected!";
          roundEnded = true;
        }
        gameActive = false;
        // Always show Next Round if game is not over
        if (!checkGameOver() && roundEnded) {
          nextRoundBtn.style.display = "inline-block";
        }
      }, 800);
    }
  }, 1000);
}

async function main() {
  await setupCamera();
  video.play();
  async function processFrame() {
    await hands.send({ image: video });
    requestAnimationFrame(processFrame);
  }
  processFrame();
}

startBtn.onclick = () => {
  startBtn.style.display = "none";
  nextRoundBtn.style.display = "none";
  playAgainBtn.style.display = "none";
  userScore = 0;
  computerScore = 0;
  round = 0;
  winnerDiv.textContent = "";
  main();
  setTimeout(startCountdown, 1000);
  document.getElementById('result').classList.remove('hidden');
};

nextRoundBtn.onclick = () => {
  nextRoundBtn.style.display = "none";
  setTimeout(startCountdown, 500);
};

playAgainBtn.onclick = () => {
  playAgainBtn.style.display = "none";
  startBtn.style.display = "";
  winnerDiv.textContent = "";
  userScore = 0;
  computerScore = 0;
  round = 0;
  updateScoreDisplay();
  updateRoundDisplay();
};

