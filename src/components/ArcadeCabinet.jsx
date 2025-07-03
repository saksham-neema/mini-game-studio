// src/components/ArcadeCabinet.jsx
import React from 'react';

function ArcadeCabinet({ gameState, watermark, children, controls }) {
  return (
    <div className={gameState === 'playing' ? 'app-fullscreen' : 'app-centered'}>
      <div className="arcade-cabinet">
        <div className="arcade-header">
          TINY ARCADE
          <p className="arcade-watermark">{watermark}</p>
        </div>
        <div className="arcade-screen">
          {children} {/* This is where the active game/menu screen will go */}
        </div>
        <div className="arcade-controls">
          {controls} {/* This is where the active buttons will go */}
        </div>
      </div>
    </div>
  );
}

export default ArcadeCabinet;