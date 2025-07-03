// src/components/GameOverScreen.jsx
import React from 'react';

function GameOverScreen({ score, highScore, onRestart, onMenu }) {
  return (
    <div className="game-over-screen">
      <h2>Game Over</h2>
      <p>Your Score: {score}</p>
      <p>High Score: {highScore}</p>
      <button className="arcade-button" onClick={onRestart}>Play Again</button>
      <button className="arcade-button" onClick={onMenu}>Back to Menu</button>
    </div>
  );
}

export default GameOverScreen;