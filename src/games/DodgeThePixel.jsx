
import React, { useState, useEffect, useRef } from 'react';


const PLAYER_SIZE = 30;
const ENEMY_SIZE = 25;
const BASE_ENEMY_SPEED = 4;
const BASE_SPAWN_CHANCE = 0.08;
const MUSIC_URL = '/dodge-the-pixel.mp3';

const ENEMY_COLORS = ['#ff4136', '#ff851b', '#b10dc9', '#f012be'];

function DodgeThePixel({ onGameOver }) {
  
  const [playerPosition, setPlayerPosition] = useState(window.innerWidth / 2);
  const [enemies, setEnemies] = useState([]);
  const [score, setScore] = useState(0);
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);
  const [screenHeight, setScreenHeight] = useState(window.innerHeight);
  
  
  const gameAreaRef = useRef(null);
  const audioRef = useRef(null);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);

  
  
  useEffect(() => {
    audioRef.current = new Audio(MUSIC_URL);
    audioRef.current.loop = true;
    audioRef.current.volume = 0.4;

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
      }
    };
  }, []); 

  
  useEffect(() => {
    const gameLoop = setInterval(() => {
      const speedMultiplier = 1 + score / 500;
      const currentSpeed = BASE_ENEMY_SPEED * speedMultiplier;
      const currentSpawnChance = Math.min(0.5, BASE_SPAWN_CHANCE + score / 2000);

      
      setEnemies(prevEnemies => {
        let newEnemies = prevEnemies
          .map(enemy => ({ ...enemy, y: enemy.y + currentSpeed }))
          .filter(enemy => enemy.y < screenHeight);

        if (Math.random() < currentSpawnChance) {
          newEnemies.push({
            x: Math.random() * (screenWidth - ENEMY_SIZE),
            y: -ENEMY_SIZE,
            color: ENEMY_COLORS[Math.floor(Math.random() * ENEMY_COLORS.length)],
          });
        }
        return newEnemies;
      });

      
      for (let enemy of enemies) {
        const playerRect = { x: playerPosition, y: screenHeight - PLAYER_SIZE, width: PLAYER_SIZE, height: PLAYER_SIZE };
        const enemyRect = { x: enemy.x, y: enemy.y, width: ENEMY_SIZE, height: ENEMY_SIZE };
        
        if (
          playerRect.x < enemyRect.x + enemyRect.width &&
          playerRect.x + playerRect.width > enemyRect.x &&
          playerRect.y < enemyRect.y + enemyRect.height &&
          playerRect.y + playerRect.height > enemyRect.y
        ) {
          onGameOver(score);
        }
      }

      
      setScore(s => s + 1);
    }, 20);

    return () => clearInterval(gameLoop);
  }, [enemies, onGameOver, playerPosition, score, screenHeight, screenWidth]);

  
  const handleMouseMove = (e) => {
    if (!isMusicPlaying && audioRef.current) {
      audioRef.current.play().catch(err => console.error("Audio playback failed:", err));
      setIsMusicPlaying(true);
    }
    const gameAreaRect = e.currentTarget.getBoundingClientRect();
    const newX = e.clientX - gameAreaRect.left - (PLAYER_SIZE / 2);
    setPlayerPosition(Math.max(0, Math.min(newX, screenWidth - PLAYER_SIZE)));
  };

  
  useEffect(() => {
    const handleResize = () => {
      if (gameAreaRef.current) {
        setScreenWidth(gameAreaRef.current.offsetWidth);
        setScreenHeight(gameAreaRef.current.offsetHeight);
      }
    };
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div
      ref={gameAreaRef}
      className="dodge-pixel-game"
      onMouseMove={handleMouseMove}
    >
      <div className="player-pixel" style={{ left: `${playerPosition}px`, bottom: 0 }}></div>
      {enemies.map((enemy, i) => (
        <div 
          key={i} 
          className="enemy-pixel" 
          style={{ 
            left: `${enemy.x}px`, 
            top: `${enemy.y}px`,
            backgroundColor: enemy.color,
            boxShadow: `0 0 15px ${enemy.color}`,
          }}
        ></div>
      ))}
      <div style={{
          position: 'absolute',
          top: '20px',
          left: '20px',
          fontSize: '24px',
          color: '#0f0',
          textShadow: '0 0 5px #0f0'
        }}>
        Score: {score}
      </div>
    </div>
  );
}

export default DodgeThePixel;