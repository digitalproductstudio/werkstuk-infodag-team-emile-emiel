// Game state types
export type GameState = "landing" | "game";
export type Player = 1 | 2; // 1 for red, 2 for blue

// Board types
export type Cell = 0 | Player; // 0 for empty, 1 for red, 2 for blue
export type GameBoard = Cell[][];

// Disc interfaces
export interface ActiveDisc {
  x: number;
  y: number;
  radius: number;
  isGrabbed: boolean;
  color: string;
}

export interface PreviewDisc {
  x: number;
  y: number;
  row: number;
  col: number;
  radius: number;
  visible: boolean;
  color: string;
}

export interface AnimatingDisc {
  x: number;      // Current x position
  y: number;      // Current y position
  targetX: number; // Target x position
  targetY: number; // Target y position
  radius: number; // Disc radius
  color: string;  // Disc color
  speed: number;  // Current vertical speed
  acceleration: number; // Acceleration (gravity)
  row: number;    // Target row
  col: number;    // Target column
  player: Player; // Player number (1 or 2)
  rotation: number; // Current rotation in radians
  rotationSpeed: number; // Rotation speed in radians per frame
  finalRotation: number; // Final rotation to approach near the end
}

export interface LandingPosition {
  row: number;
  col: number;
  x: number;
  y: number;
}

// Winning position
export interface WinningPosition {
  row: number;
  col: number;
}

// Cell rotation
export interface CellRotation {
  rotation: number;
}

// Game configuration
export interface GameConfig {
  rows: number;
  cols: number;
  cellSize: number;
  discRadius: number;
}

// Dimensions
export interface GameDimensions {
  videoWidth: number;
  videoHeight: number;
  canvasWidth: number;
  canvasHeight: number;
}