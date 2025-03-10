import {
  GameState,
  GameBoard,
  Player,
  GameConfig,
  GameDimensions,
  ActiveDisc,
  PreviewDisc,
  AnimatingDisc,
  WinningPosition
} from './types';
import { createGameBoard } from './gameLogic';

// Game status and tracking
export let appState: GameState = "landing";
export let thumbUpTime: number = 0;
export const requiredThumbTime: number = 2000; // 2 seconds in milliseconds
export let progressBarWidth: number = 0;
export let gameOver: boolean = false;
export let winningPositions: WinningPosition[] | null = null;
export let winTimer: number = 0;
export const winTimerDuration: number = 15000; // 15 seconds in milliseconds

/**
 * Set the app state
 */
export function setAppState(state: GameState): void {
  appState = state;
}

/**
 * Set the game over state
 */
export function setGameOver(value: boolean): void {
  gameOver = value;
}

/**
 * Set the winning positions
 */
export function setWinningPositions(positions: WinningPosition[] | null): void {
  winningPositions = positions;
}

/**
 * Update the win timer
 */
export function updateWinTimer(deltaTime: number): number {
  winTimer += deltaTime;
  return winTimer;
}

/**
 * Reset the win timer
 */
export function resetWinTimer(): void {
  winTimer = 0;
}

// Game state
export let currentPlayer: Player = 1; // 1 for red, 2 for blue
export let gameBoard: GameBoard;
export let discRotations: (number | null)[][]; // Store rotation angles for each disc
export let animatingDiscs: AnimatingDisc[] = [];

// Active disc that can be moved
export let activeDisc: ActiveDisc;

// Preview disc that shows where the active disc will land
export let previewDisc: PreviewDisc;

/**
 * Initialize the game state
 */
export function initializeGameState(gameConfig: GameConfig, canvasWidth: number): void {
  gameBoard = createGameBoard(gameConfig.rows, gameConfig.cols);
  discRotations = Array(gameConfig.rows).fill(null).map(() => Array(gameConfig.cols).fill(null));
  
  // Position red discs on the right side
  const discX = currentPlayer === 1 ? 
    canvasWidth * 0.75 : // Right side for red
    canvasWidth * 0.25;  // Left side for blue
  
  activeDisc = { 
    x: discX, 
    y: gameConfig.cellSize / 2, 
    radius: gameConfig.discRadius, 
    isGrabbed: false,
    color: "#ef7d00"
  };
  
  previewDisc = {
    x: 0,
    y: 0,
    row: -1,
    col: -1,
    radius: gameConfig.discRadius,
    visible: false,
    color: "rgba(0, 0, 0, 0)" // Will be set based on current player with transparency
  };
}

/**
 * Reset the game state
 */
export function resetGame(gameConfig: GameConfig, canvasWidth: number): void {
  gameBoard = createGameBoard(gameConfig.rows, gameConfig.cols);
  discRotations = Array(gameConfig.rows).fill(null).map(() => Array(gameConfig.cols).fill(null));
  gameOver = false;
  currentPlayer = 1;
  animatingDiscs = []; // Clear any animating discs
  winningPositions = null; // Reset winning positions
  resetWinTimer(); // Reset the win timer
  
  activeDisc = { 
    x: canvasWidth * 0.75, // Start with orange on the right side
    y: gameConfig.cellSize / 2, 
    radius: gameConfig.discRadius, 
    isGrabbed: false,
    color: "#ef7d00"
  };
}

/**
 * Start the game after landing page verification
 */
export function startGame(): void {
  appState = "game";
  thumbUpTime = 0;
  progressBarWidth = 0;
}

/**
 * Switch to the next player
 */
export function switchPlayer(canvasWidth: number): void {
  currentPlayer = currentPlayer === 1 ? 2 : 1;
  
  // Position the new disc based on the player:
  // Red (Player 1) on the right, Blue (Player 2) on the left
  const newX = currentPlayer === 1 ? 
    canvasWidth * 0.75 : // Right side for red
    canvasWidth * 0.25;  // Left side for blue
  
  // Update active disc color and position based on current player
  activeDisc.color = currentPlayer === 1 ? "#ef7d00" : "#009ad4";
  activeDisc.x = newX;
  activeDisc.y = activeDisc.radius+5; // Reset vertical position too
}

/**
 * Add an animating disc to the game state
 */
export function addAnimatingDisc(disc: AnimatingDisc): void {
  animatingDiscs.push(disc);
}

/**
 * Remove an animating disc from the array
 */
export function removeAnimatingDisc(index: number): void {
  animatingDiscs.splice(index, 1);
}

/**
 * Update the progress bar for landing page
 */
export function updateThumbProgress(deltaTime: number): void {
  thumbUpTime += deltaTime;
  progressBarWidth = Math.min(thumbUpTime / requiredThumbTime, 1);
}

/**
 * Reset the thumb progress
 */
export function resetThumbProgress(): void {
  thumbUpTime = 0;
  progressBarWidth = 0;
}

/**
 * Check if thumb progress is complete
 */
export function isThumbProgressComplete(): boolean {
  return thumbUpTime >= requiredThumbTime;
}