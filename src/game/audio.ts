// Import sound files directly
import placeSoundSrc from '../assets/sounds/place.mp3';
import winSoundSrc from '../assets/sounds/win.mp3';
import startSoundSrc from '../assets/sounds/start.mp3';
import grabSoundSrc from '../assets/sounds/grab.mp3';
import explosionSoundSrc from '../assets/sounds/bomb.mp3';

// Audio elements for game sounds
let placeSound: HTMLAudioElement | null = null;
let winSound: HTMLAudioElement | null = null;
let startSound: HTMLAudioElement | null = null;
let grabSound: HTMLAudioElement | null = null;
let explosionSound: HTMLAudioElement | null = null;

/**
 * Initialize audio elements
 */
export function initializeAudio(): void {
  // Create and configure Place Sound
  placeSound = new Audio();
  placeSound.src = placeSoundSrc;
  placeSound.volume = 0.5;
  
  // Create and configure Win Sound
  winSound = new Audio();
  winSound.src = winSoundSrc;
  winSound.volume = 0.7;
  
  // Create and configure Start Sound
  startSound = new Audio();
  startSound.src = startSoundSrc;
  startSound.volume = 0.6;
  
  // Create and configure Grab Sound
  grabSound = new Audio();
  grabSound.src = grabSoundSrc;
  grabSound.volume = 0.4;
  
  // Create and configure Explosion Sound
  explosionSound = new Audio();
  explosionSound.src = explosionSoundSrc;
  explosionSound.volume = 0.7;
}

/**
 * Play disc placement sound
 */
export function playPlaceSound(): void {
  if (placeSound) {
    placeSound.currentTime = 0;
    placeSound.play().catch(error => {
      console.error("Error playing place sound:", error);
    });
  }
}

/**
 * Play win celebration sound
 */
export function playWinSound(): void {
  if (winSound) {
    winSound.currentTime = 0;
    winSound.play().catch(error => {
      console.error("Error playing win sound:", error);
    });
  }
}

/**
 * Play game start sound
 */
export function playStartSound(): void {
  if (startSound) {
    startSound.currentTime = 0;
    startSound.play().catch(error => {
      console.error("Error playing start sound:", error);
    });
  }
}

/**
 * Play disc grab sound
 */
export function playGrabSound(): void {
  if (grabSound) {
    grabSound.currentTime = 0;
    grabSound.play().catch(error => {
      console.error("Error playing grab sound:", error);
    });
  }
}

/**
 * Play bomb explosion sound
 */
export function playExplosionSound(): void {
  if (explosionSound) {
    explosionSound.currentTime = 0;
    explosionSound.play().catch(error => {
      console.error("Error playing explosion sound:", error);
    });
  }
}