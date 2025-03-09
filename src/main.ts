import {
  GestureRecognizer,
  FilesetResolver,
  DrawingUtils
} from "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.3";

const demosSection = document.getElementById("demos");
let gestureRecognizer: GestureRecognizer;
let runningMode = "IMAGE";
let webcamRunning: Boolean = false;

// Responsive dimensions
let videoWidth: number;
let videoHeight: number;
let canvasWidth: number;
let canvasHeight: number;

// Game setup
const ROWS = 6;
const COLS = 7;
let CELL_SIZE: number; // Will be calculated based on screen width
let DISC_RADIUS: number; // Will be calculated based on CELL_SIZE
let currentPlayer = 1; // 1 for red, 2 for blue
let gameBoard = Array(ROWS).fill(null).map(() => Array(COLS).fill(0));
let gameOver = false;

// Landing page tracking
let appState = "landing"; // "landing", "game"
let thumbUpTime = 0;
const requiredThumbTime = 2000; // 2 seconds in milliseconds
let progressBarWidth = 0;

// Active disc that can be moved
let activeDisc = { 
  x: 0, // Will be set properly during setup
  y: 0, // Will be set properly during setup
  radius: 0, // Will be set properly during setup
  isGrabbed: false,
  color: currentPlayer === 1 ? "red" : "blue"
};

const createGestureRecognizer = async () => {
  const vision = await FilesetResolver.forVisionTasks(
    "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.3/wasm"
  );
  gestureRecognizer = await GestureRecognizer.createFromOptions(vision, {
    baseOptions: {
      modelAssetPath:
        "https://storage.googleapis.com/mediapipe-models/gesture_recognizer/gesture_recognizer/float16/1/gesture_recognizer.task",
      delegate: "GPU"
    },
    runningMode: runningMode
  });
  demosSection.classList.remove("invisible");
  // Automatically start camera when recognizer is ready
  enableCam();
};
createGestureRecognizer();

const video = document.getElementById("webcam") as HTMLVideoElement;
const canvasElement = document.getElementById("output_canvas") as HTMLCanvasElement;
const canvasCtx = canvasElement.getContext("2d");
const gestureOutput = document.getElementById("gesture_output");

// Function to setup dimensions based on window size
function setupDimensions() {
  // Get window dimensions
  videoWidth = window.innerWidth;
  videoHeight = window.innerHeight;
  
  // Set video dimensions
  video.style.width = videoWidth + "px";
  video.style.height = videoHeight + "px";
  
  // Calculate game board dimensions
  canvasWidth = window.innerWidth;
  canvasHeight = window.innerHeight;
  CELL_SIZE = Math.min(canvasWidth / COLS, canvasHeight / (ROWS + 2)); // +2 to leave room at top and bottom
  DISC_RADIUS = CELL_SIZE * 0.4;
  
  // Update canvas dimensions
  canvasElement.width = canvasWidth;
  canvasElement.height = canvasHeight;
  
  // Position the active disc initially at the top of the game area
  activeDisc.x = canvasWidth / 2;
  activeDisc.y = CELL_SIZE / 2;
  activeDisc.radius = DISC_RADIUS;
}

// Call setup on load and window resize
window.addEventListener('load', setupDimensions);
window.addEventListener('resize', () => {
  setupDimensions();
  resetGame(); // Reset game to adjust all positions
});

function hasGetUserMedia() {
  return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
}

function enableCam() {
  if (!gestureRecognizer) {
    alert("Please wait for gestureRecognizer to load");
    return;
  }
  
  if (!webcamRunning) {
    webcamRunning = true;
  }

  navigator.mediaDevices.getUserMedia({ 
    video: { 
      width: { ideal: window.innerWidth },
      height: { ideal: window.innerHeight }
    } 
  }).then(function (stream) {
    video.srcObject = stream;
    video.addEventListener("loadeddata", predictWebcam);
  });
}

// Reset the game
function resetGame() {
  gameBoard = Array(ROWS).fill(null).map(() => Array(COLS).fill(0));
  gameOver = false;
  currentPlayer = 1;
  activeDisc = { 
    x: canvasWidth / 2, 
    y: CELL_SIZE / 2, 
    radius: DISC_RADIUS, 
    isGrabbed: false,
    color: "red"
  };
}

// Start the game after landing page verification
function startGame() {
  appState = "game";
  thumbUpTime = 0;
  progressBarWidth = 0;
  resetGame();
}

// Check if there's a winner
function checkWin(row, col) {
  const directions = [
    [0, 1],  // horizontal
    [1, 0],  // vertical
    [1, 1],  // diagonal down-right
    [1, -1]  // diagonal down-left
  ];
  
  for (const [dr, dc] of directions) {
    let count = 1;
    
    // Check in positive direction
    for (let i = 1; i <= 3; i++) {
      const r = row + i * dr;
      const c = col + i * dc;
      if (r < 0 || r >= ROWS || c < 0 || c >= COLS || gameBoard[r][c] !== currentPlayer) break;
      count++;
    }
    
    // Check in negative direction
    for (let i = 1; i <= 3; i++) {
      const r = row - i * dr;
      const c = col - i * dc;
      if (r < 0 || r >= ROWS || c < 0 || c >= COLS || gameBoard[r][c] !== currentPlayer) break;
      count++;
    }
    
    if (count >= 4) return true;
  }
  
  return false;
}

// Drop the disc in the selected column
function dropDisc(col) {
  if (gameOver) return false;
  
  // Find the lowest empty row in the selected column
  for (let row = ROWS - 1; row >= 0; row--) {
    if (gameBoard[row][col] === 0) {
      gameBoard[row][col] = currentPlayer;
      
      // Check for a win
      if (checkWin(row, col)) {
        gameOver = true;
      }
      
      // Switch players
      currentPlayer = currentPlayer === 1 ? 2 : 1;
      
      // Reset the active disc
      activeDisc = { 
        x: col * CELL_SIZE + CELL_SIZE / 2, 
        y: CELL_SIZE / 2, 
        radius: DISC_RADIUS, 
        isGrabbed: false,
        color: currentPlayer === 1 ? "red" : "blue"
      };
      
      return true;
    }
  }
  
  return false; // Column is full
}

// Drawing the landing page with thumb verification
function drawLandingPage() {
  // Clear the canvas
  canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
  
  // Add semi-transparent overlay
  canvasCtx.fillStyle = "rgba(0, 0, 0, 0.5)";
  canvasCtx.fillRect(0, 0, canvasElement.width, canvasElement.height);
  
  // Draw title
  canvasCtx.fillStyle = "#FFFFFF";
  canvasCtx.font = "bold 36px Arial";
  canvasCtx.textAlign = "center";
  canvasCtx.fillText("4 The Win", canvasWidth / 2, canvasHeight / 4);
  
  // Instructions
  canvasCtx.font = "24px Arial";
  canvasCtx.fillText("Hold up a 👍 for 2 seconds to start", canvasWidth / 2, canvasHeight / 3);
  
  // Progress bar background
  const barWidth = canvasWidth * 0.6;
  const barHeight = 30;
  const barX = (canvasWidth - barWidth) / 2;
  const barY = canvasHeight / 2;
  
  canvasCtx.fillStyle = "#444444";
  canvasCtx.fillRect(barX, barY, barWidth, barHeight);
  
  // Progress bar fill
  canvasCtx.fillStyle = "#00FF00";
  canvasCtx.fillRect(barX, barY, progressBarWidth * barWidth, barHeight);
  
  // Progress percentage
  canvasCtx.fillStyle = "#000000";
  canvasCtx.font = "16px Arial";
  canvasCtx.fillText(`${Math.floor(progressBarWidth * 100)}%`, barX + barWidth / 2, barY + barHeight / 2 + 5);
}

let lastVideoTime = -1;
let results = undefined;
let lastTimestamp = 0;

async function predictWebcam() {
  if (runningMode === "IMAGE") {
    runningMode = "VIDEO";
    await gestureRecognizer.setOptions({ runningMode: "VIDEO" });
  }

  let nowInMs = Date.now();
  const deltaTime = lastTimestamp ? nowInMs - lastTimestamp : 0;
  lastTimestamp = nowInMs;
  
  if (video.currentTime !== lastVideoTime) {
    lastVideoTime = video.currentTime;
    results = await gestureRecognizer.recognizeForVideo(video, nowInMs);
  }

  // If we're on the landing page
  if (appState === "landing") {
    drawLandingPage();
    
    // Check for thumb up gesture
    if (results && results.gestures.length > 0) {
      const gestureName = results.gestures[0][0].categoryName;
      
      if (gestureName === "Thumb_Up") {
        thumbUpTime += deltaTime;
        progressBarWidth = Math.min(thumbUpTime / requiredThumbTime, 1);
        
        if (thumbUpTime >= requiredThumbTime) {
          startGame();
        }
      } else {
        // Reset progress if thumb is removed
        thumbUpTime = 0;
        progressBarWidth = 0;
      }
    }
  } 
  // If the game is active
  else if (appState === "game") {
    canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
    const drawingUtils = new DrawingUtils(canvasCtx);

    // Draw the game board
    drawGameBoard();

    if (results && results.landmarks) {
      for (const landmarks of results.landmarks) {
        drawingUtils.drawConnectors(
          landmarks,
          GestureRecognizer.HAND_CONNECTIONS,
          { color: "#00FF00", lineWidth: 5 }
        );
        drawingUtils.drawLandmarks(landmarks, { color: "#FF0000", lineWidth: 2 });

        // Get the hand center position (index finger base for tracking)
        let handX = landmarks[9].x * canvasElement.width;
        let handY = landmarks[9].y * canvasElement.height;

        // Detect grab or release gesture
        const gestureName = results.gestures[0]?.[0]?.categoryName;
        if (gestureName === "Closed_Fist") {
          if (!activeDisc.isGrabbed) {
            const dx = handX - activeDisc.x;
            const dy = handY - activeDisc.y;
            if (Math.sqrt(dx * dx + dy * dy) < activeDisc.radius * 2) {
              activeDisc.isGrabbed = true;
            }
          }
        } else if (gestureName === "Open_Palm") {
          if (activeDisc.isGrabbed) {
            // When releasing, try to drop the disc
            const col = Math.floor((activeDisc.x - getBoardStartX()) / CELL_SIZE);
            if (col >= 0 && col < COLS) {
              dropDisc(col);
            }
          }
          activeDisc.isGrabbed = false;
        }

        if (activeDisc.isGrabbed) {
          activeDisc.x = handX;
          // Limit vertical movement to just below the top of the board
          activeDisc.y = Math.min(CELL_SIZE, handY);
        }
      }
    }

    // Draw the active disc
    canvasCtx.beginPath();
    canvasCtx.arc(activeDisc.x, activeDisc.y, activeDisc.radius, 0, 2 * Math.PI);
    canvasCtx.fillStyle = activeDisc.color;
    canvasCtx.fill();
    canvasCtx.stroke();

    // Display game status
    canvasCtx.font = "20px Arial";
    canvasCtx.fillStyle = "black";
    
    if (gameOver) {
      canvasCtx.fillText(`Player ${currentPlayer === 1 ? 2 : 1} wins! Click to reset.`,canvasWidth / 2, 30);
      
      // Add click listener to reset game
      canvasElement.onclick = () => {
        resetGame();
      };
    } else {
      canvasCtx.fillText(`Current player: ${currentPlayer === 1 ? "Red" : "Blue"}`, canvasWidth / 2, 30);
      canvasElement.onclick = null;
    }
  }

  if (webcamRunning) {
    window.requestAnimationFrame(predictWebcam);
  }
}

// Helper function to calculate board start X position
function getBoardStartX() {
  return (canvasWidth - (CELL_SIZE * COLS)) / 2;
}

// Helper function to calculate board start Y position (at bottom of screen)
function getBoardStartY() {
  return canvasHeight - CELL_SIZE * ROWS - CELL_SIZE/2;
}

// Draw the game board
function drawGameBoard() {
  // Calculate the position to center the board horizontally and place at bottom
  const boardStartX = getBoardStartX();
  const boardStartY = getBoardStartY();
  
  // Save the current context state
  canvasCtx.save();
  
  // Apply transparency (80% opacity = 0.8 alpha)
  canvasCtx.globalAlpha = 0.8;
  
  // Draw board background
  canvasCtx.fillStyle = "#FFC107";
  canvasCtx.fillRect(boardStartX, boardStartY, CELL_SIZE * COLS, CELL_SIZE * ROWS);
  
  // Draw grid lines
  canvasCtx.strokeStyle = "#000";
  canvasCtx.lineWidth = 1;
  
  // Draw cells and pieces
  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLS; col++) {
      const centerX = boardStartX + col * CELL_SIZE + CELL_SIZE / 2;
      const centerY = boardStartY + row * CELL_SIZE + CELL_SIZE / 2;
      
      // Draw empty slot
      canvasCtx.beginPath();
      canvasCtx.arc(centerX, centerY, DISC_RADIUS, 0, 2 * Math.PI);
      
      if (gameBoard[row][col] === 0) {
        canvasCtx.fillStyle = "white";
      } else if (gameBoard[row][col] === 1) {
        canvasCtx.fillStyle = "red";
      } else {
        canvasCtx.fillStyle = "blue";
      }
      
      canvasCtx.fill();
      canvasCtx.stroke();
    }
  }
  
  // Restore the context to its original state (resets transparency)
  canvasCtx.restore();
}