// src/games/FlappyDot.jsx

import React, { useState, useEffect, useRef } from 'react';

// --- Game Constants ---
const BIRD_SIZE_H = 24;
const BIRD_SIZE_W = 34;
const BIRD_LEFT = 80;
const GRAVITY_ACCELERATION = 0.6;
const JUMP_VELOCITY = -9;
const PIPE_WIDTH = 65;
const PIPE_GAP = 200;
const PIPE_HORIZONTAL_GAP = 380;
const GAME_SPEED = 4;
const MUSIC_URL = '/flappy-dot.mp3';

function FlappyDot({ onGameOver }) {
  // --- State Hooks ---
  const [birdPosition, setBirdPosition] = useState(300);
  const [birdVelocity, setBirdVelocity] = useState(0);
  const [pipes, setPipes] = useState([]);
  const [score, setScore] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [screenHeight, setScreenHeight] = useState(window.innerHeight);
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);
  
  // --- Audio State & Ref ---
  const audioRef = useRef(null);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);

  // --- CORRECTED: Audio setup useEffect ---
  // This hook is now at the top level of the component, where it belongs.
  useEffect(() => {
    audioRef.current = new Audio(MUSIC_URL);
    audioRef.current.loop = true;
    audioRef.current.volume = 0.3;

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
      }
    };
  }, []); // Runs once on mount

  // --- Main Game Loop useEffect ---
  useEffect(() => {
    if (!gameStarted) return;

    const gameLoop = setInterval(() => {
      // --- Bird Physics ---
      setBirdPosition(prevPos => {
        const newVelocity = birdVelocity + GRAVITY_ACCELERATION;
        setBirdVelocity(newVelocity);
        return prevPos + newVelocity;
      });

      // --- Pipe Logic ---
      setPipes(prevPipes => {
        const movedPipes = prevPipes.map(pipe => ({ ...pipe, x: pipe.x - GAME_SPEED }));

        movedPipes.forEach(pipe => {
          if (!pipe.passed && pipe.x + PIPE_WIDTH < BIRD_LEFT) {
            setScore(s => s + 1);
            pipe.passed = true;
          }
        });
        
        const filteredPipes = movedPipes.filter(pipe => pipe.x > -PIPE_WIDTH);
        const lastPipe = filteredPipes[filteredPipes.length - 1];

        if (!lastPipe || screenWidth - lastPipe.x > PIPE_HORIZONTAL_GAP) {
          const newPipeHeight = Math.floor(Math.random() * (screenHeight - PIPE_GAP - 150)) + 75;
          filteredPipes.push({
            x: screenWidth,
            topHeight: newPipeHeight,
            passed: false,
          });
        }
        return filteredPipes;
      });

      // --- Collision Detection (Now works correctly) ---
      // Ground collision
      if (birdPosition > screenHeight - BIRD_SIZE_H) {
        onGameOver(score);
      }
      // Pipe collision
      for (let pipe of pipes) {
        if (
          BIRD_LEFT + BIRD_SIZE_W > pipe.x && BIRD_LEFT < pipe.x + PIPE_WIDTH
        ) {
          if (birdPosition < pipe.topHeight || birdPosition + BIRD_SIZE_H > pipe.topHeight + PIPE_GAP) {
            onGameOver(score);
          }
        }
      }

    }, 20);

    return () => clearInterval(gameLoop);
  }, [gameStarted, birdPosition, birdVelocity, pipes, onGameOver, score, screenHeight, screenWidth]);

  // --- Handle User Input ---
  const handleFlap = () => {
    if (!isMusicPlaying && audioRef.current) {
      audioRef.current.play().catch(e => console.error("Audio playback failed:", e));
      setIsMusicPlaying(true);
    }
    if (!gameStarted) {
      setGameStarted(true);
    }
    setBirdVelocity(JUMP_VELOCITY);
  };
  
  // --- Handle Window Resizing ---
  useEffect(() => {
    const handleResize = () => {
      setScreenHeight(window.innerHeight);
      setScreenWidth(window.innerWidth);
    };
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Calculate rotation based on velocity
  const birdRotation = Math.min(Math.max(-20, birdVelocity * 4), 90);

  return (
    <div className="flappy-dot-game" onClick={handleFlap}>
      <div className="score-display">{score}</div>
      <div 
        className="bird" 
        style={{ 
          top: `${birdPosition}px`, 
          left: `${BIRD_LEFT}px`,
          transform: `rotate(${birdRotation}deg)`
        }}
      ></div>
      {pipes.map((pipe, index) => (
        <React.Fragment key={index}>
          <div
            className="pipe pipe-top"
            style={{ left: `${pipe.x}px`, height: `${pipe.topHeight}px`, top: 0 }}
          ></div>
          <div
            className="pipe pipe-bottom"
            style={{
              left: `${pipe.x}px`,
              height: `${screenHeight - pipe.topHeight - PIPE_GAP}px`,
              top: `${pipe.topHeight + PIPE_GAP}px`,
            }}
          ></div>
        </React.Fragment>
      ))}
      {!gameStarted && (
        <div style={{ position: 'absolute', top: '40%', width: '100%', textAlign: 'center', fontSize: '24px', color: 'white' }}>
          Tap to Start
        </div>
      )}
    </div>
  );
}

export default FlappyDot;