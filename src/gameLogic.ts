import {
  GameBoard,
  Player,
  LandingPosition,
  GameConfig,
  AnimatingDisc,
  ActiveDisc,
  PreviewDisc,
  WinningPosition
} from './types';

/**
 * Initialize a new game board
 */
export function createGameBoard(rows: number, cols: number): GameBoard {
  return Array(rows).fill(null).map(() => Array(cols).fill(0));
}

/**
 * Check if the current player has won
 * Returns winning positions if there's a win, null otherwise
 */
export function checkWin(
  gameBoard: GameBoard, 
  row: number, 
  col: number, 
  player: Player
): WinningPosition[] | null {
  const directions = [
    [0, 1],  // horizontal
    [1, 0],  // vertical
    [1, 1],  // diagonal down-right
    [1, -1]  // diagonal down-left
  ];
  
  const rows = gameBoard.length;
  const cols = gameBoard[0].length;
  
  for (const [dr, dc] of directions) {
    let count = 1;
    let winningPositions: WinningPosition[] = [{ row, col }];
    
    // Check in positive direction
    for (let i = 1; i <= 3; i++) {
      const r = row + i * dr;
      const c = col + i * dc;
      if (r < 0 || r >= rows || c < 0 || c >= cols || gameBoard[r][c] !== player) break;
      count++;
      winningPositions.push({ row: r, col: c });
    }
    
    // Check in negative direction
    for (let i = 1; i <= 3; i++) {
      const r = row - i * dr;
      const c = col - i * dc;
      if (r < 0 || r >= rows || c < 0 || c >= cols || gameBoard[r][c] !== player) break;
      count++;
      winningPositions.push({ row: r, col: c });
    }
    
    if (count >= 4) return winningPositions;
  }
  
  return null;
}

/**
 * Calculate board start X position
 */
export function getBoardStartX(canvasWidth: number, cellSize: number, cols: number): number {
  return (canvasWidth - (cellSize * cols)) / 2;
}

/**
 * Calculate board start Y position
 */
export function getBoardStartY(canvasHeight: number, cellSize: number, rows: number): number {
  return canvasHeight - cellSize * rows - cellSize/2;
}

/**
 * Calculate where a disc would land in a given column
 */
export function calculateLandingPosition(
  gameBoard: GameBoard,
  col: number,
  gameConfig: GameConfig,
  canvasWidth: number,
  canvasHeight: number
): LandingPosition | null {
  const { rows, cols, cellSize } = gameConfig;
  
  if (col < 0 || col >= cols) return null;
  
  // Find the lowest empty row in the selected column
  for (let row = rows - 1; row >= 0; row--) {
    if (gameBoard[row][col] === 0) {
      const boardStartX = getBoardStartX(canvasWidth, cellSize, cols);
      const boardStartY = getBoardStartY(canvasHeight, cellSize, rows);
      
      // Calculate target position
      const targetX = boardStartX + col * cellSize + cellSize / 2;
      const targetY = boardStartY + row * cellSize + cellSize / 2;
      
      return {
        row: row,
        col: col,
        x: targetX,
        y: targetY
      };
    }
  }
  
  return null; // Column is full
}

/**
 * Start animation for dropping a disc
 */
export function startDiscAnimation(
  activeDisc: ActiveDisc,
  landingPosition: LandingPosition,
  discRadius: number,
  currentPlayer: Player
): AnimatingDisc {
  // Generate random rotation speed (between 0.05 and 0.2 radians per frame)
  const rotationSpeed = 0.05 + Math.random() * 0.15;
  
  // Generate random final rotation (between 0 and 2π)
  const finalRotation = Math.random() * Math.PI * 2;
  
  return {
    x: activeDisc.x,
    y: activeDisc.y,
    targetX: landingPosition.x,
    targetY: landingPosition.y,
    radius: discRadius,
    color: activeDisc.color,
    speed: 0,
    acceleration: 0.5,
    row: landingPosition.row,
    col: landingPosition.col,
    player: currentPlayer,
    rotation: 0, // Start with 0 rotation
    rotationSpeed: rotationSpeed,
    finalRotation: finalRotation
  };
}

/**
 * Update an animating disc for one frame
 * Returns true if the animation is complete
 */
export function updateAnimatingDisc(disc: AnimatingDisc): boolean {
  // Apply gravity effect for vertical movement
  disc.speed += disc.acceleration;
  disc.y += disc.speed;
  
  // Move horizontally towards the target (smooth transition)
  const dx = disc.targetX - disc.x;
  disc.x += dx * 0.2; // Smooth horizontal movement
  
  // Update rotation
  disc.rotation += disc.rotationSpeed;
  
  // When approaching the target, gradually slow down rotation and align to final rotation
  const distanceToTarget = disc.targetY - disc.y;
  if (distanceToTarget < disc.radius * 4) {
    // Smoothly transition to the final rotation
    const rotationDiff = disc.finalRotation - disc.rotation;
    disc.rotation += rotationDiff * 0.1;
    
    // Gradually reduce rotation speed as well
    disc.rotationSpeed *= 0.9;
  }
  
  // Check if the disc has reached or passed its target vertically
  return disc.y >= disc.targetY;
}

/**
 * Reset the preview disc visibility
 */
export function resetPreviewDisc(previewDisc: PreviewDisc): void {
  previewDisc.visible = false;
}

/**
 * Update the preview disc based on active disc position
 */
export function updatePreviewDisc(
  previewDisc: PreviewDisc,
  activeDisc: ActiveDisc,
  gameBoard: GameBoard,
  col: number,
  gameConfig: GameConfig,
  canvasWidth: number,
  canvasHeight: number
): void {
  const landingPosition = calculateLandingPosition(
    gameBoard, col, gameConfig, canvasWidth, canvasHeight
  );
  
  if (landingPosition && col >= 0 && col < gameConfig.cols) {
    previewDisc.x = landingPosition.x;
    previewDisc.y = landingPosition.y;
    previewDisc.row = landingPosition.row;
    previewDisc.col = landingPosition.col;
    previewDisc.visible = true;
    previewDisc.color = activeDisc.color === "#ef7d00" ? 
      "rgba(239, 125, 0, 0.3)" : "rgba(0, 154, 212, 0.3)";
  } else {
    previewDisc.visible = false;
  }
}

/**
 * Drop a disc in the selected column with animation
 * Returns the new animating disc if successful, null otherwise
 */
export function dropDisc(
  col: number,
  gameBoard: GameBoard,
  gameConfig: GameConfig,
  dimensions: { canvasWidth: number, canvasHeight: number },
  activeDisc: ActiveDisc,
  currentPlayer: Player
): AnimatingDisc | null {
  if (col < 0 || col >= gameConfig.cols) return null;
  
  const landingPosition = calculateLandingPosition(
    gameBoard, 
    col, 
    gameConfig, 
    dimensions.canvasWidth, 
    dimensions.canvasHeight
  );
  
  if (!landingPosition) return null; // Column is full
  
  // Create and return the animating disc
  return startDiscAnimation(
    activeDisc, 
    landingPosition, 
    gameConfig.discRadius, 
    currentPlayer
  );
}

/**
 * Calculate the current column based on x position
 */
export function calculateCurrentColumn(
  x: number,
  gameConfig: GameConfig,
  canvasWidth: number
): number {
  const boardStartX = getBoardStartX(canvasWidth, gameConfig.cellSize, gameConfig.cols);
  return Math.floor((x - boardStartX) / gameConfig.cellSize);
}