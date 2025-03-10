/**
 * Sound effects for the game
 */
let placeSound: HTMLAudioElement;
let winSound: HTMLAudioElement;
let startSound: HTMLAudioElement;
let grabSound: HTMLAudioElement;
let isAudioInitialized = false;

/**
 * Initialize audio elements and load sound files
 */
export function initializeAudio(): void {
  // Create audio elements
  placeSound = new Audio();
  winSound = new Audio();
  startSound = new Audio();
  grabSound = new Audio();
  
  // Set sources
  placeSound.src = 'sounds/coin-drop.mp3';
  winSound.src = 'sounds/marimba-win.mp3';
  startSound.src = 'sounds/start.mp3';
  grabSound.src = 'sounds/grab.mp3';
  
  // Set volume
  placeSound.volume = 0.6;
  winSound.volume = 0.8;
  startSound.volume = 0.7;
  grabSound.volume = 0.6;
  
  // Preload the audio files
  placeSound.load();
  winSound.load();
  startSound.load();
  grabSound.load();
  
  isAudioInitialized = true;
  
  // Add error handlers
  placeSound.onerror = () => console.error("Error loading place sound");
  winSound.onerror = () => console.error("Error loading win sound");
  startSound.onerror = () => console.error("Error loading start sound");
  grabSound.onerror = () => console.error("Error loading grab sound");
}

/**
 * Play the disc placement sound
 */
export function playPlaceSound(): void {
  if (!isAudioInitialized) return;
  
  // Clone and play to allow overlapping sounds
  const sound = placeSound.cloneNode() as HTMLAudioElement;
  sound.play().catch(error => {
    console.warn("Could not play place sound:", error);
  });
}

/**
 * Play the win sound
 */
export function playWinSound(): void {
  if (!isAudioInitialized) return;
  
  winSound.play().catch(error => {
    console.warn("Could not play win sound:", error);
  });
}

/**
 * Play the start sound
 */
export function playStartSound(): void {
  if (!isAudioInitialized) return;
  
  startSound.play().catch(error => {
    console.warn("Could not play start sound:", error);
  });
}

/**
 * Play the grab sound
 */
export function playGrabSound(): void {
  if (!isAudioInitialized) return;
  
  // Clone and play to allow overlapping sounds
  const sound = grabSound.cloneNode() as HTMLAudioElement;
  sound.play().catch(error => {
    console.warn("Could not play grab sound:", error);
  });
}