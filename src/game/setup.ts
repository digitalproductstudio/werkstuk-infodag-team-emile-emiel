import { GameConfig, GameDimensions } from '../types/types';
import { initializeGameState } from './gameState';
import { initializeGestureRecognizer } from './gestureRecognition';
import { initializeAudio } from './audio';

// Import images directly
import qrCodeSrc from '../assets/images/qr-code.png';
import arteLogoSrc from '../assets/images/arte-logo.png';
import closedHandSrc from '../assets/images/closed-hand.jpg';
import openHandSrc from '../assets/images/open-hand.jpg';
import peaceHandSrc from '../assets/images/peace-hand.png';

// Game images
export let qrCodeImage: HTMLImageElement | null = null;
export let arteLogoImage: HTMLImageElement | null = null;

// Instruction images
export let closedHandImage: HTMLImageElement | null = null;
export let openHandImage: HTMLImageElement | null = null;
export let peaceHandImage: HTMLImageElement | null = null;

/**
 * Game configuration
 */
export const gameConfig: GameConfig = {
  rows: 6,
  cols: 7,
  cellSize: 0, // Will be calculated based on screen width
  discRadius: 0 // Will be calculated based on cellSize
};

/**
 * Display dimensions
 */
export const dimensions: GameDimensions = {
  videoWidth: 0,
  videoHeight: 0,
  canvasWidth: 0,
  canvasHeight: 0
};

/**
 * Initialize the game
 */
export async function initialize(
  video: HTMLVideoElement, 
  canvasElement: HTMLCanvasElement
): Promise<void> {
  await initializeGestureRecognizer("demos");
  setupDimensions(video, canvasElement);
  initializeGameState(gameConfig, dimensions.canvasWidth);
  initializeAudio(); // Initialize sound effects
  preloadQRCode(); // Preload QR code image
  preloadArteLogo(); // Preload Arte logo image
  preloadInstructionImages(); // Preload instruction images
}

/**
 * Preload QR code image
 */
function preloadQRCode(): void {
  qrCodeImage = new Image();
  qrCodeImage.src = qrCodeSrc;
  
  qrCodeImage.onerror = () => {
    console.error('Error loading QR code image');
    qrCodeImage = null;
  };
}

/**
 * Preload Arte logo image
 */
function preloadArteLogo(): void {
  arteLogoImage = new Image();
  arteLogoImage.src = arteLogoSrc;
  
  arteLogoImage.onerror = () => {
    console.error('Error loading Arte logo image');
    arteLogoImage = null;
  };
}

/**
 * Preload instruction images
 */
function preloadInstructionImages(): void {
  // Closed hand image
  closedHandImage = new Image();
  closedHandImage.src = closedHandSrc;
  closedHandImage.onerror = () => {
    console.error('Error loading closed hand image');
    closedHandImage = null;
  };
  
  // Open hand image
  openHandImage = new Image();
  openHandImage.src = openHandSrc;
  openHandImage.onerror = () => {
    console.error('Error loading open hand image');
    openHandImage = null;
  };
  
  // Peace hand image
  peaceHandImage = new Image();
  peaceHandImage.src = peaceHandSrc;
  peaceHandImage.onerror = () => {
    console.error('Error loading peace hand image');
    peaceHandImage = null;
  };
}

/**
 * Setup dimensions based on window size
 */
export function setupDimensions(
  video: HTMLVideoElement, 
  canvas: HTMLCanvasElement
): void {
  // Get window dimensions
  dimensions.videoWidth = window.innerWidth;
  dimensions.videoHeight = window.innerHeight;
  
  // Set video dimensions
  video.style.width = dimensions.videoWidth + "px";
  video.style.height = dimensions.videoHeight + "px";
  
  // Calculate game board dimensions
  dimensions.canvasWidth = window.innerWidth;
  dimensions.canvasHeight = window.innerHeight;
  
  // Calculate game config based on screen size
  gameConfig.cellSize = Math.min(
    dimensions.canvasWidth / gameConfig.cols, 
    dimensions.canvasHeight / (gameConfig.rows + 2)
  ); // +2 to leave room at top and bottom
  
  gameConfig.discRadius = gameConfig.cellSize * 0.4;
  
  // Update canvas dimensions
  canvas.width = dimensions.canvasWidth;
  canvas.height = dimensions.canvasHeight;
}