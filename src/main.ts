window.addEventListener('resize', handleResize);

import {
  gameConfig,
  dimensions,
  initialize,
  setupDimensions
} from './setup';

import {
  playPlaceSound,
  playWinSound,
  playStartSound,
  playGrabSound
} from './audio';

import {
  appState,
  gameOver,
  currentPlayer,
  gameBoard,
  discRotations,
  animatingDiscs,
  activeDisc,
  previewDisc,
  thumbUpTime,
  progressBarWidth,
  resetGame,
  startGame,
  switchPlayer,
  addAnimatingDisc,
  removeAnimatingDisc,
  updateThumbProgress,
  resetThumbProgress,
  isThumbProgressComplete,
  setGameOver,
  setWinningPositions,
  winningPositions,
  updateWinTimer,
  winTimerDuration,
  setAppState
} from './gameState';

import {
  checkWin,
  updateAnimatingDisc,
  resetPreviewDisc,
  updatePreviewDisc,
  dropDisc
} from './gameLogic';

import {
  processVideoFrame,
  setupWebcam,
  updateTimestamp,
  processHandGestures
} from './gestureRecognition';

import {
  drawLandingPage,
  drawGameBoard,
  drawActiveDisc,
  drawPreviewDisc,
  drawAnimatingDisc,
  drawGameStatus
} from './rendering';

// DOM Elements
const demosSection = document.getElementById("demos");
const video = document.getElementById("webcam") as HTMLVideoElement;
const canvasElement = document.getElementById("output_canvas") as HTMLCanvasElement;
const canvasCtx = canvasElement.getContext("2d");

// Game status tracking
let webcamRunning: boolean = false;

// Initialize and start game
window.addEventListener('load', () => {
  console.log("Window loaded, initializing game...");
  initialize(video, canvasElement)
    .then(() => {
      console.log("Game initialized, enabling webcam...");
      enableCam();
    })
    .catch(error => {
      console.error("Error initializing game:", error);
      // Show error on screen for debugging
      if (canvasCtx) {
        canvasCtx.fillStyle = "white";
        canvasCtx.font = "20px Arial";
        canvasCtx.fillText(`Initialization error: ${error.message}`, 20, 40);
      }
    });
});

/**
 * Handle window resize
 */
function handleResize() {
  setupDimensions(video, canvasElement);
  resetGame(gameConfig, dimensions.canvasWidth);
}

/**
 * Enable webcam access
 */
function enableCam() {
  if (!webcamRunning) {
    webcamRunning = true;
  }

  setupWebcam(video, predictWebcam);
}

/**
 * Main game loop
 */
async function predictWebcam() {
  try {
    const deltaTime = updateTimestamp();
    const results = await processVideoFrame(video, Date.now());

    // Handle current app state
    if (appState === "landing") {
      handleLandingState(results, deltaTime);
    } else if (appState === "game") {
      handleGameState(results, deltaTime);
    }

    if (webcamRunning) {
      window.requestAnimationFrame(predictWebcam);
    }
  } catch (error) {
    console.error("Error in game loop:", error);
    // Display error on screen
    if (canvasCtx) {
      canvasCtx.fillStyle = "white";
      canvasCtx.font = "20px Arial";
      canvasCtx.fillText(`Game error: ${error.message}`, 20, 70);
      
      // Try to continue the game loop
      if (webcamRunning) {
        window.requestAnimationFrame(predictWebcam);
      }
    }
  }
}

/**
 * Handle landing page state
 */
function handleLandingState(results: any, deltaTime: number) {
  drawLandingPage(
    canvasCtx, 
    dimensions.canvasWidth, 
    dimensions.canvasHeight, 
    progressBarWidth
  );
  
  // Check for thumb up gesture
  if (results && results.gestures && results.gestures.length > 0) {
    const gestureName = results.gestures[0][0].categoryName;
    
    if (gestureName === "Thumb_Up") {
      updateThumbProgress(deltaTime);
      
      if (isThumbProgressComplete()) {
        playStartSound(); // Play start sound when the game begins
        startGame();
        resetGame(gameConfig, dimensions.canvasWidth);
      }
    } else {
      // Reset progress if a different gesture is detected
      resetThumbProgress();
    }
  } else {
    // Reset progress if no hand is detected (tracking lost)
    resetThumbProgress();
  }
}

/**
 * Handle game state
 */
function handleGameState(results: any, deltaTime: number) {
  canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);

  // Draw the game board
  drawGameBoard(
    canvasCtx, 
    gameBoard, 
    gameConfig, 
    dimensions.canvasWidth, 
    dimensions.canvasHeight
  );
  
  // Update and draw animating discs
  updateAnimatingDiscs();
  
  // Process hand gestures only if game is not over
  if (!gameOver) {
    processHandGestures(
      results,
      activeDisc,
      gameBoard,
      gameConfig,
      dimensions.canvasWidth,
      dimensions.canvasHeight,
      handleDiscGrab,
      handleDiscRelease,
      handleDiscMove,
      canvasCtx
    );
  }

  // Draw the preview and active discs (only if game is not over)
  if (!gameOver) {
    drawPreviewDisc(canvasCtx, previewDisc);
    drawActiveDisc(canvasCtx, activeDisc);
  }

  // Handle game over timer
  if (gameOver) {
    const winTime = updateWinTimer(deltaTime);
    const timeLeft = Math.max(0, Math.ceil((winTimerDuration - winTime) / 1000));
    
    // Display game status with timer
    drawGameStatus(
      canvasCtx, 
      gameOver, 
      currentPlayer, 
      dimensions.canvasWidth,
      timeLeft
    );
    
    // Check if timer expired
    if (winTime >= winTimerDuration) {
      // Reset to landing page
      setAppState("landing");
      resetGame(gameConfig, dimensions.canvasWidth);
    }
  } else {
    // Display normal game status
    drawGameStatus(
      canvasCtx, 
      gameOver, 
      currentPlayer, 
      dimensions.canvasWidth
    );
  }
  
  // Remove the click to reset logic - we now use a timer
  canvasElement.onclick = null;
}

/**
 * Update and draw animating discs
 */
function updateAnimatingDiscs() {
  for (let i = animatingDiscs.length - 1; i >= 0; i--) {
    const disc = animatingDiscs[i];
    
    // Update disc position
    const animationComplete = updateAnimatingDisc(disc);
    
    if (animationComplete) {
      // Place the disc in its final position
      disc.x = disc.targetX;
      disc.y = disc.targetY;
      
      // Store the final rotation
      discRotations[disc.row][disc.col] = disc.rotation;
      
      // Update the game board
      gameBoard[disc.row][disc.col] = disc.player;
      
      // Check for a win using the player who just made the move
      const positions = checkWin(gameBoard, disc.row, disc.col, disc.player);
      if (positions) {
        setWinningPositions(positions);
        setGameOver(true);
        playWinSound(); // Play win sound when a player wins
      }
      
      // Remove this disc from the animating array
      removeAnimatingDisc(i);
    }
    
    // Draw the animating disc
    drawAnimatingDisc(canvasCtx, disc);
  }
}

/**
 * Handle when a disc is grabbed
 */
function handleDiscGrab(x: number, y: number) {
  if (!activeDisc.isGrabbed) {
    const dx = x - activeDisc.x;
    const dy = y - activeDisc.y;
    if (Math.sqrt(dx * dx + dy * dy) < activeDisc.radius * 2) {
      activeDisc.isGrabbed = true;
      playGrabSound(); // Play grab sound when a disc is grabbed
    }
  }
}

/**
 * Handle when a disc is released
 */
function handleDiscRelease(col: number) {
  if (activeDisc.isGrabbed && !gameOver) {
    if (col >= 0 && col < gameConfig.cols) {
      const newDisc = dropDisc(
        col, 
        gameBoard, 
        gameConfig, 
        dimensions, 
        activeDisc, 
        currentPlayer
      );
      
      if (newDisc) {
        addAnimatingDisc(newDisc);
        playPlaceSound(); // Play sound when disc is placed
        switchPlayer(dimensions.canvasWidth);
      }
    }
  }
  activeDisc.isGrabbed = false;
  resetPreviewDisc(previewDisc); // Hide preview when not grabbing
}

/**
 * Handle disc movement
 */
function handleDiscMove(x: number, y: number, col: number) {
  activeDisc.x = x;
  activeDisc.y = Math.min(gameConfig.cellSize, y);
  
  updatePreviewDisc(
    previewDisc,
    activeDisc,
    gameBoard,
    col,
    gameConfig,
    dimensions.canvasWidth,
    dimensions.canvasHeight
  );
}