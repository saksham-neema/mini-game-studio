// src/games/ColorCatch.jsx

import React, { useState, useEffect, useCallback, useRef } from 'react';

// --- Game Constants ---
const BASE_PALETTE = ['#e74c3c', '#3498db', '#2ecc71', '#f1c40f', '#9b59b6'];
const EXPANDED_PALETTE = [...BASE_PALETTE, '#e67e22', '#1abc9c', '#34495e'];
const MUSIC_URL = '/color-catch.mp3';
const BPM = 90;

// --- Helper Functions ---
const getRandomColor = (palette, excludeColor = null) => {
  let availableColors = palette.filter(c => c !== excludeColor);
  return availableColors[Math.floor(Math.random() * availableColors.length)];
};

function ColorCatch({ onGameOver }) {
  const [targetColor, setTargetColor] = useState(() => getRandomColor(BASE_PALETTE));
  const [currentColor, setCurrentColor] = useState(() => getRandomColor(BASE_PALETTE, targetColor));
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(1);
  const [message, setMessage] = useState('Tap To Start The Music!');
  
  const [palette, setPalette] = useState(BASE_PALETTE);
  const [msPerBeat, setMsPerBeat] = useState((60 / BPM) * 1000);
  
  // --- NEW: Refs and State for Audio Control ---
  const audioRef = useRef(null); // To hold the Audio object
  const [isMusicPlaying, setIsMusicPlaying] = useState(false); // To track if music has started

  const comboRef = useRef(null);

  // --- MODIFIED: Music and Audio Management ---
  useEffect(() => {
    // 1. Create the Audio object and store it in the ref.
    audioRef.current = new Audio(MUSIC_URL);
    audioRef.current.loop = true;
    audioRef.current.volume = 0.4;
    
    // We DO NOT call .play() here anymore.

    // 2. Cleanup function to stop music when the game unmounts.
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
      }
    };
  }, []); // Empty array ensures this runs only once on mount.

  // The rest of the useEffects remain the same...
  useEffect(() => {
    if (!isMusicPlaying) return; // Don't run the color changer until music starts

    const colorChanger = setInterval(() => {
      setCurrentColor(getRandomColor(palette));
    }, msPerBeat);

    return () => clearInterval(colorChanger);
  }, [msPerBeat, palette, isMusicPlaying]);

  useEffect(() => {
    if (score >= 150 && msPerBeat > 400) {
      setMsPerBeat(((60 / BPM) * 1000) / 2);
      setMessage('SPEED UP!');
    }
    if (score >= 300 && palette.length < EXPANDED_PALETTE.length) {
      setPalette(EXPANDED_PALETTE);
      setMessage('MORE COLORS!');
    }
  }, [score, msPerBeat, palette]);

  // --- MODIFIED: Handle Player Input ---
  const handleTap = useCallback(() => {
    // --- NEW: Start music on the very first tap ---
    if (!isMusicPlaying && audioRef.current) {
      audioRef.current.play().catch(e => console.error("Audio playback failed:", e));
      setIsMusicPlaying(true);
      setMessage('Match The Colors!'); // Update instructions
    }
    // --- End of new logic ---

    if (currentColor === targetColor) {
      // SUCCESS logic (remains the same)
      const points = 10 * combo;
      const newScore = score + points;
      const newCombo = combo + 1;
      
      setScore(newScore);
      setCombo(newCombo);
      setMessage(`+${points}!`);
      
      const newTarget = getRandomColor(palette, currentColor);
      setTargetColor(newTarget);

      if (comboRef.current) {
        comboRef.current.classList.add('pop');
        setTimeout(() => comboRef.current?.classList.remove('pop'), 200);
      }

    } else {
      // Don't end the game on the very first tap if it was just to start music
      if (isMusicPlaying) {
        onGameOver(score);
      }
    }
  }, [currentColor, targetColor, score, combo, onGameOver, palette, isMusicPlaying]);

  return (
    <div className="color-catch-game" onClick={handleTap}>
      <div className="target-display">
        TARGET
        <div className="target-color-box" style={{ backgroundColor: targetColor }}></div>
      </div>
      
      <div className="color-orb" style={{ backgroundColor: currentColor }}></div>
      
      <p className="game-message">{message}</p>
      
      <div style={{ position: 'absolute', bottom: '20px', left: '20px', fontSize: '24px', color: '#fff' }}>
        Score: {score}
      </div>

      {combo > 1 && (
        <div ref={comboRef} className="combo-display">
          x{combo}
        </div>
      )}
    </div>
  );
}

export default ColorCatch;