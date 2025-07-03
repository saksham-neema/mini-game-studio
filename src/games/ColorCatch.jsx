

import React, { useState, useEffect, useCallback, useRef } from 'react';


const BASE_PALETTE = ['#e74c3c', '#3498db', '#2ecc71', '#f1c40f', '#9b59b6'];
const EXPANDED_PALETTE = [...BASE_PALETTE, '#e67e22', '#1abc9c', '#34495e'];
const MUSIC_URL = '/color-catch.mp3';
const BPM = 90;


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
  
  
  const audioRef = useRef(null); 
  const [isMusicPlaying, setIsMusicPlaying] = useState(false); 

  const comboRef = useRef(null);

  
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
    if (!isMusicPlaying) return; 

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

  
  const handleTap = useCallback(() => {
    
    if (!isMusicPlaying && audioRef.current) {
      audioRef.current.play().catch(e => console.error("Audio playback failed:", e));
      setIsMusicPlaying(true);
      setMessage('Match The Colors!'); 
    }
    

    if (currentColor === targetColor) {
      
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