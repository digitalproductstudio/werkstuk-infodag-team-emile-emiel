import {
  GameBoard,
  GameConfig,
  ActiveDisc,
  PreviewDisc,
  AnimatingDisc,
  WinningPosition,
  Explosion
} from './types';

import {
  getBoardStartX,
  getBoardStartY
} from './gameLogic';

import { 
  winningPositions, 
  discRotations, 
  discTypes, 
  playerBombs, 
  currentPlayer, 
  bombSelected,
  explosions,
  bombImage
} from './gameState';
import { qrCodeImage, arteLogoImage } from './setup';

/**
 * Check if a position is part of the winning positions
 */
function isWinningPosition(row: number, col: number): boolean {
  if (!winningPositions) return false;
  return winningPositions.some(pos => pos.row === row && pos.col === col);
}

/**
 * Draw the landing page with progress bar
 */
export function drawLandingPage(
  canvasCtx: CanvasRenderingContext2D,
  canvasWidth: number,
  canvasHeight: number,
  progressBarWidth: number
): void {
  // Clear the canvas
  canvasCtx.clearRect(0, 0, canvasWidth, canvasHeight);
  
  // Add semi-transparent overlay
  canvasCtx.fillStyle = "rgba(0, 0, 0, 0.5)";
  canvasCtx.fillRect(0, 0, canvasWidth, canvasHeight);
  
  // Draw title
  canvasCtx.fillStyle = "#FFFFFF";
  canvasCtx.font = "bold 36px Arial";
  canvasCtx.textAlign = "center";
  canvasCtx.fillText("4 THE WIN", canvasWidth / 2, canvasHeight / 4);
  
  // Start instructions
  canvasCtx.font = "24px Arial";
  canvasCtx.fillText("Houd je duim 👍 omhoog voor 2 seconden om te beginnen", canvasWidth / 2, canvasHeight / 3);
  
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
  
  // Game instructions - added below the progress bar
  canvasCtx.fillStyle = "#FFFFFF";
  canvasCtx.font = "20px Arial";
  
  // How to play section
  const instructionsY = barY + barHeight + 40;
  canvasCtx.font = "bold 22px Arial";
  canvasCtx.fillText("Hoe te Spelen:", canvasWidth / 2, instructionsY);
  
  // Game controls
  canvasCtx.font = "18px Arial";
  canvasCtx.fillText("• Maak een GESLOTEN VUIST ✊ om een schijf te pakken", canvasWidth / 2, instructionsY + 30);
  canvasCtx.fillText("• Beweeg je hand om de schijf boven een kolom te plaatsen", canvasWidth / 2, instructionsY + 55);
  canvasCtx.fillText("• Gebruik een OPEN HANDPALM 🖐️ om de schijf los te laten", canvasWidth / 2, instructionsY + 80);
  canvasCtx.fillText("• Gebruik PEACE-teken ✌️ om tussen schijf en bom te wisselen", canvasWidth / 2, instructionsY + 105);
  
  // Game objective
  canvasCtx.font = "bold 22px Arial";
  canvasCtx.fillText("Doel:", canvasWidth / 2, instructionsY + 145);
  
  canvasCtx.font = "18px Arial";
  canvasCtx.fillText("Verbind 4 schijven van jouw kleur op een rij - horizontaal, verticaal of diagonaal", canvasWidth / 2, instructionsY + 175);
  
  // Power-up info
  canvasCtx.font = "bold 22px Arial";
  canvasCtx.fillText("Power-up:", canvasWidth / 2, instructionsY + 215);
  
  canvasCtx.font = "18px Arial";
  canvasCtx.fillText("Elke speler heeft 1 bom die alle aangrenzende schijven laat exploderen", canvasWidth / 2, instructionsY + 245);
  
  // Players required info
  canvasCtx.font = "bold 22px Arial";
  canvasCtx.fillText("Spelers:", canvasWidth / 2, instructionsY + 285);
  
  canvasCtx.font = "18px Arial";
  canvasCtx.fillText("Dit is een spel voor 2 spelers - Rood (rechterkant) vs Blauw (linkerkant)", canvasWidth / 2, instructionsY + 315);

  // Draw QR code in bottom right corner
  // Set title for QR code
  canvasCtx.font = "bold 16px Arial";
  canvasCtx.textAlign = "center";
  
  // QR code dimensions and position
  const qrSize = 150;
  const qrPadding = 30;
  const qrX = canvasWidth - qrSize - qrPadding;
  const qrY = canvasHeight - qrSize - qrPadding;
  
  // Draw QR code title above the QR code
  canvasCtx.fillStyle = "#FFFFFF";
  canvasCtx.fillText("Meer info over IMD", qrX + qrSize/2, qrY - 10);
  
  // Draw QR code
  drawQRCode(canvasCtx, qrX, qrY, qrSize);

  // Add attribution text at the bottom of the screen
  canvasCtx.font = "16px Arial";
  canvasCtx.fillStyle = "#FFFFFF";
  canvasCtx.textAlign = "center";
  canvasCtx.fillText("- Gemaakt door Emile Bergers en Emiel Clopterop IMD2 -", canvasWidth / 2, canvasHeight - 20);
}


/**
 * Draw the game board
 */
export function drawGameBoard(
  canvasCtx: CanvasRenderingContext2D,
  gameBoard: GameBoard,
  gameConfig: GameConfig,
  canvasWidth: number,
  canvasHeight: number
): void {
  const { rows, cols, cellSize, discRadius } = gameConfig;
  
  // Calculate the position to center the board horizontally and place at bottom
  const boardStartX = getBoardStartX(canvasWidth, cellSize, cols);
  const boardStartY = getBoardStartY(canvasHeight, cellSize, rows);
  
  // Save the current context state
  canvasCtx.save();
  
  // Apply transparency (80% opacity = 0.8 alpha)
  canvasCtx.globalAlpha = 0.7;
  
  // Draw board background
  canvasCtx.fillStyle = "#5ab946";
  canvasCtx.fillRect(boardStartX, boardStartY, cellSize * cols, cellSize * rows);
  
  // Draw grid lines
  canvasCtx.strokeStyle = "#000";
  canvasCtx.lineWidth = 1;
  
  // Calculate pulse effect for winning discs
  const pulse = Math.sin(Date.now() / 200) * 0.3 + 0.7; // Value between 0.4 and 1.0
  
  // Draw cells and pieces
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const centerX = boardStartX + col * cellSize + cellSize / 2;
      const centerY = boardStartY + row * cellSize + cellSize / 2;
      
      if (gameBoard[row][col] === 0) {
        // For empty slots, create see-through holes
        // First, draw the "hole" by cutting through the board
        canvasCtx.save();
        canvasCtx.globalCompositeOperation = 'destination-out';
        canvasCtx.beginPath();
        canvasCtx.arc(centerX, centerY, discRadius, 0, 2 * Math.PI);
        canvasCtx.fill();
        canvasCtx.restore();
        
        // Draw a subtle stroke for the hole
        canvasCtx.beginPath();
        canvasCtx.arc(centerX, centerY, discRadius, 0, 2 * Math.PI);
        canvasCtx.strokeStyle = "rgba(0, 0, 0, 0.3)";
        canvasCtx.stroke();
      } else {
        // Check if this disc is part of the winning positions
        const isWinning = isWinningPosition(row, col);
        
        // Get the stored rotation, or default to 0 if not set
        const rotation = discRotations[row][col] || 0;
        
        // Check if this disc is a bomb
        const isBomb = discTypes[row][col] === "bomb";
        
        // Save the canvas state to apply rotation
        canvasCtx.save();
        
        // Translate to the disc center, rotate, and translate back
        canvasCtx.translate(centerX, centerY);
        canvasCtx.rotate(rotation);
        canvasCtx.translate(-centerX, -centerY);
        
        // Draw filled discs for players
        canvasCtx.beginPath();
        canvasCtx.arc(centerX, centerY, discRadius, 0, 2 * Math.PI);
        
        // Use brighter colors for winning discs
        if (gameBoard[row][col] === 1) {
          canvasCtx.fillStyle = isWinning ? "#ff9e4d" : "#ef7d00"; // Brighter orange for winning
        } else {
          canvasCtx.fillStyle = isWinning ? "#4dbfe8" : "#009ad4"; // Brighter blue for winning
        }
        
        canvasCtx.fill();
        canvasCtx.strokeStyle = "black";
        canvasCtx.stroke();
        
        // If it's a bomb, draw the bomb image instead of the Arte logo
        if (isBomb && bombImage && bombImage.complete) {
          // Calculate size for the bomb (smaller than the disc)
          const bombSize = discRadius * 1.6;
          
          // Create a clipping path that's the shape of the disc
          canvasCtx.save();
          canvasCtx.beginPath();
          canvasCtx.arc(centerX, centerY, discRadius, 0, 2 * Math.PI);
          canvasCtx.clip();
          
          // Draw the bomb centered in the disc
          canvasCtx.drawImage(
            bombImage,
            centerX - bombSize / 2,
            centerY - bombSize / 2,
            bombSize,
            bombSize
          );
          
          canvasCtx.restore();
        } else {
          // Draw the Arte logo inside the disc for normal discs
          drawArteLogoInDisc(canvasCtx, centerX, centerY, discRadius * 0.8);
        }
        
        // Add glow effect for winning discs
        if (isWinning) {
          // Save the current state
          canvasCtx.save();
          
          // Draw outer glow
          canvasCtx.beginPath();
          canvasCtx.arc(centerX, centerY, discRadius * 1.2, 0, 2 * Math.PI);
          
          // Different colors for different players
          if (gameBoard[row][col] === 1) {
            canvasCtx.strokeStyle = "#FFD700"; // Gold for orange discs
          } else {
            canvasCtx.strokeStyle = "#00FFFF"; // Cyan for blue discs
          }
          
          canvasCtx.lineWidth = 3;
          canvasCtx.stroke();
          
          // Draw pulsating outer ring
          canvasCtx.beginPath();
          canvasCtx.arc(centerX, centerY, discRadius * (1.0 + pulse * 0.3), 0, 2 * Math.PI);
          
          if (gameBoard[row][col] === 1) {
            canvasCtx.strokeStyle = `rgba(255, 215, 0, ${pulse * 0.6})`; // Gold with varying opacity
          } else {
            canvasCtx.strokeStyle = `rgba(0, 255, 255, ${pulse * 0.6})`; // Cyan with varying opacity
          }
          
          canvasCtx.lineWidth = 2;
          canvasCtx.stroke();
          
          // Draw inner highlight
          canvasCtx.beginPath();
          canvasCtx.arc(centerX, centerY, discRadius * 0.6, 0, 2 * Math.PI);
          
          if (gameBoard[row][col] === 1) {
            canvasCtx.fillStyle = `rgba(255, 225, 180, ${pulse * 0.8})`; // Light orange inner glow
          } else {
            canvasCtx.fillStyle = `rgba(180, 230, 255, ${pulse * 0.8})`; // Light blue inner glow
          }
          
          canvasCtx.fill();
          
          // Restore the context
          canvasCtx.restore();
        }
        
        // Restore the canvas state after applying rotation
        canvasCtx.restore();
      }
    }
  }
  
  // Draw explosions
  for (const explosion of explosions) {
    canvasCtx.beginPath();
    canvasCtx.arc(explosion.x, explosion.y, explosion.radius, 0, 2 * Math.PI);
    canvasCtx.fillStyle = `rgba(255, 200, 0, ${explosion.alpha * 0.5})`;
    canvasCtx.fill();
    
    // Draw outer ring
    canvasCtx.beginPath();
    canvasCtx.arc(explosion.x, explosion.y, explosion.radius * 0.8, 0, 2 * Math.PI);
    canvasCtx.strokeStyle = `rgba(255, 100, 0, ${explosion.alpha * 0.8})`;
    canvasCtx.lineWidth = 3;
    canvasCtx.stroke();
  }
  
  // Restore the context to its original state (resets transparency)
  canvasCtx.restore();
}

/**
 * Draw an active disc
 */
export function drawActiveDisc(
  canvasCtx: CanvasRenderingContext2D,
  activeDisc: ActiveDisc
): void {
  canvasCtx.beginPath();
  canvasCtx.arc(activeDisc.x, activeDisc.y, activeDisc.radius, 0, 2 * Math.PI);
  canvasCtx.fillStyle = activeDisc.color;
  canvasCtx.fill();
  canvasCtx.strokeStyle = "black";
  canvasCtx.stroke();
  
  // Draw different images based on disc type
  if (activeDisc.type === "bomb" && bombImage && bombImage.complete) {
    const bombSize = activeDisc.radius * 1.6;
    
    // Create a clipping path that's the shape of the disc
    canvasCtx.save();
    canvasCtx.beginPath();
    canvasCtx.arc(activeDisc.x, activeDisc.y, activeDisc.radius, 0, 2 * Math.PI);
    canvasCtx.clip();
    
    // Draw the bomb centered in the disc
    canvasCtx.drawImage(
      bombImage,
      activeDisc.x - bombSize / 2,
      activeDisc.y - bombSize / 2,
      bombSize,
      bombSize
    );
    
    canvasCtx.restore();
  } else {
    // Draw the Arte logo inside the active disc for normal discs
    drawArteLogoInDisc(canvasCtx, activeDisc.x, activeDisc.y, activeDisc.radius * 0.8);
  }
}

/**
 * Draw a preview disc
 */
export function drawPreviewDisc(
  canvasCtx: CanvasRenderingContext2D,
  previewDisc: PreviewDisc
): void {
  if (!previewDisc.visible) return;
  
  canvasCtx.beginPath();
  canvasCtx.arc(previewDisc.x, previewDisc.y, previewDisc.radius, 0, 2 * Math.PI);
  canvasCtx.fillStyle = previewDisc.color;
  canvasCtx.fill();
  canvasCtx.strokeStyle = "rgba(0, 0, 0, 0.3)";
  canvasCtx.stroke();
  
  // For the preview disc, we'll apply some transparency to the image as well
  canvasCtx.globalAlpha = 0.3;
  
  // Draw different images based on disc type
  if (previewDisc.type === "bomb" && bombImage && bombImage.complete) {
    const bombSize = previewDisc.radius * 1.6;
    
    // Create a clipping path that's the shape of the disc
    canvasCtx.save();
    canvasCtx.beginPath();
    canvasCtx.arc(previewDisc.x, previewDisc.y, previewDisc.radius, 0, 2 * Math.PI);
    canvasCtx.clip();
    
    // Draw the bomb centered in the disc
    canvasCtx.drawImage(
      bombImage,
      previewDisc.x - bombSize / 2,
      previewDisc.y - bombSize / 2,
      bombSize,
      bombSize
    );
    
    canvasCtx.restore();
  } else {
    // Draw the Arte logo inside the preview disc for normal discs
    drawArteLogoInDisc(canvasCtx, previewDisc.x, previewDisc.y, previewDisc.radius * 0.8);
  }
  
  canvasCtx.globalAlpha = 1.0; // Reset alpha
}

/**
 * Draw animating discs
 */
export function drawAnimatingDisc(
  canvasCtx: CanvasRenderingContext2D,
  disc: AnimatingDisc
): void {
  // Save the canvas state
  canvasCtx.save();
  
  // Translate to the disc center, rotate, and translate back
  canvasCtx.translate(disc.x, disc.y);
  canvasCtx.rotate(disc.rotation);
  canvasCtx.translate(-disc.x, -disc.y);
  
  // Draw the disc
  canvasCtx.beginPath();
  canvasCtx.arc(disc.x, disc.y, disc.radius, 0, 2 * Math.PI);
  canvasCtx.fillStyle = disc.color;
  canvasCtx.fill();
  canvasCtx.stroke();
  
  // Draw different images based on disc type
  if (disc.type === "bomb" && bombImage && bombImage.complete) {
    const bombSize = disc.radius * 1.6;
    
    // Create a clipping path that's the shape of the disc
    canvasCtx.save();
    canvasCtx.beginPath();
    canvasCtx.arc(disc.x, disc.y, disc.radius, 0, 2 * Math.PI);
    canvasCtx.clip();
    
    // Draw the bomb centered in the disc
    canvasCtx.drawImage(
      bombImage,
      disc.x - bombSize / 2,
      disc.y - bombSize / 2,
      bombSize,
      bombSize
    );
    
    canvasCtx.restore();
  } else {
    // Draw the Arte logo inside the animating disc for normal discs
    drawArteLogoInDisc(canvasCtx, disc.x, disc.y, disc.radius * 0.8);
  }
  
  // Restore the canvas state
  canvasCtx.restore();
}

/**
 * Draw game status text
 */
export function drawGameStatus(
  canvasCtx: CanvasRenderingContext2D,
  gameOver: boolean,
  currentPlayer: number,
  canvasWidth: number,
  timeLeft?: number
): void {
  canvasCtx.font = "30px Arial";
  canvasCtx.fillStyle = "black";
  canvasCtx.textAlign = "center";
  
  if (gameOver) {
    // The winner is the opposite of the current player since we already switched
    const winner = currentPlayer === 1 ? 2 : 1;
    canvasCtx.font = "50px Arial";
    
    // Set text color based on the winning player (orange or blue)
    canvasCtx.fillStyle = winner === 1 ? "#ef7d00" : "#009ad4";
    
    canvasCtx.fillText(
      `Speler ${winner === 1 ? "Oranje" : "Blauw"} wint!${timeLeft ? ` Terug naar startscherm in ${timeLeft}s` : ''}`, 
      canvasWidth / 2, 
      60
    );
  } else {
    canvasCtx.fillText(
      `Huidige speler: ${currentPlayer === 1 ? "Oranje" : "Blauw"}`, 
      canvasWidth / 2, 
      30
    );
    
    // Show bomb toggle hint if player has bombs available
    if (playerBombs[currentPlayer] > 0) {
      canvasCtx.font = "16px Arial";
      canvasCtx.fillText(
        bombSelected ? "Bom actief! ✌️ om terug te wisselen" : "✌️ om bom te activeren", 
        canvasWidth / 2, 
        60
      );
    }
  }
}

/**
 * Draw QR code image on the canvas
 */
function drawQRCode(
  canvasCtx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number
): void {
  // If we have a preloaded QR code image, draw it
  if (qrCodeImage && qrCodeImage.complete) {
    canvasCtx.drawImage(qrCodeImage, x, y, size, size);
  } else {
    // Draw a placeholder if the image isn't available or hasn't loaded yet
    // Add a white background for the QR code placeholder
    canvasCtx.fillStyle = '#FFFFFF';
    canvasCtx.fillRect(x, y, size, size);
    
    // Add text to the placeholder
    canvasCtx.font = '12px Arial';
    canvasCtx.fillStyle = '#000000';
    canvasCtx.textAlign = 'center';
    canvasCtx.fillText('QR-code', x + size/2, y + size/2);
  }
}

/**
 * Draw Arte logo inside a disc
 */
function drawArteLogoInDisc(
  canvasCtx: CanvasRenderingContext2D,
  x: number,
  y: number,
  radius: number
): void {
  if (arteLogoImage && arteLogoImage.complete) {
    // Calculate the size for the logo (smaller than the disc)
    const logoSize = radius * 1.5;
    
    // Draw the logo centered within the disc
    canvasCtx.save();
    
    // Create a clipping path that's the shape of the disc
    canvasCtx.beginPath();
    canvasCtx.arc(x, y, radius, 0, 2 * Math.PI);
    canvasCtx.clip();
    
    // Draw the logo centered in the disc
    canvasCtx.drawImage(
      arteLogoImage,
      x - logoSize / 2,
      y - logoSize / 2,
      logoSize,
      logoSize
    );
    
    canvasCtx.restore();
  }
}