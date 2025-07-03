// src/App.jsx
import React, { useState } from 'react';

// Import all our components
import ArcadeCabinet from './components/ArcadeCabinet';
import WelcomeScreen from './components/WelcomeScreen';
import GameMenu from './components/GameMenu';
import GameOverScreen from './components/GameOverScreen';
import Footer from './components/Footer';

// Import the games
import FlappyDot from './games/FlappyDot';
import DodgeThePixel from './games/DodgeThePixel';
import ColorCatch from './games/ColorCatch';

// Import the new CSS file
import './components/Footer.css';

function App() {
  // --- STATE MANAGEMENT (Stays the same) ---
  const [gameState, setGameState] = useState('welcome');
  const [score, setScore] = useState(0);
  const [activeGame, setActiveGame] = useState(null);

  // --- DATA & HELPERS (Stays the same) ---
  const games = [
    { id: 'flappy-dot', name: 'Flappy Dot' },
    { id: 'dodge-the-pixel', name: 'Dodge The Pixel' },
    { id: 'color-catch', name: 'Color Catch' },
  ];

  const getHighScores = () => {
    const scores = localStorage.getItem('minigameHighScores');
    return scores ? JSON.parse(scores) : {};
  };

  const saveHighScore = (gameId, newScore) => {
    const highScores = getHighScores();
    const oldHighScore = highScores[gameId] || 0;
    if (newScore > oldHighScore) {
        highScores[gameId] = newScore;
        localStorage.setItem('minigameHighScores', JSON.stringify(highScores));
    }
  };
  
  // --- EVENT HANDLERS (Stays the same) ---
  const startGame = (gameId) => {
    setActiveGame(gameId);
    setGameState('playing');
    setScore(0);
  };

  const handleGameOver = (finalScore) => {
    setScore(finalScore);
    saveHighScore(activeGame, finalScore);
    setGameState('gameOver');
  };

  const backToMenu = () => {
    setActiveGame(null);
    setGameState('menu');
  };

  // --- RENDER LOGIC (Now returns components) ---
  const renderGame = () => {
    switch (activeGame) {
      case 'flappy-dot': return <FlappyDot onGameOver={handleGameOver} />;
      case 'dodge-the-pixel': return <DodgeThePixel onGameOver={handleGameOver} />;
      case 'color-catch': return <ColorCatch onGameOver={handleGameOver} />;
      default: return <p>Game not found!</p>;
    }
  };

  const renderGameScreen = () => {
    switch (gameState) {
      case 'welcome': return <WelcomeScreen />;
      case 'menu': return <GameMenu games={games} onSelectGame={startGame} />;
      case 'playing': return renderGame();
      case 'gameOver':
        const highScores = getHighScores();
        const highScore = highScores[activeGame] || 0;
        return <GameOverScreen score={score} highScore={highScore} onRestart={() => startGame(activeGame)} onMenu={backToMenu} />;
      default: return <p>Error</p>;
    }
  };

  const renderControls = () => {
    switch (gameState) {
      case 'welcome': return <button className="arcade-button blinking-button" onClick={() => setGameState('menu')}>Insert Coin</button>;
      case 'playing': return <p>Good Luck!</p>;
      default: return <p>Use the screen to navigate.</p>;
    }
  };

  // --- FINAL RENDER (Much cleaner!) ---
   return (
        <> {/* A Fragment to hold both the cabinet and footer */}
          <ArcadeCabinet
            gameState={gameState}
            watermark="- by Shubhi Sharma -"
            controls={renderControls()}
          >
            {renderGameScreen()}
          </ArcadeCabinet>

          {/* 
            This is the conditional rendering logic.
            The footer will only be rendered if it's NOT the case that
            the game is 'playing' AND the active game is 'dodge-the-pixel'.
          */}
          {!(gameState === 'playing' && activeGame === 'dodge-the-pixel') && (
            <Footer
              githubUrl="https://github.com/shvbhii/Tiny-Arcade.git" 
              linkedinUrl="https://www.linkedin.com/in/shvbhi" 
            />
          )}
        </>
      );
}

export default App;