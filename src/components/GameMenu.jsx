// src/components/GameMenu.jsx
import React from 'react';

function GameMenu({ games, onSelectGame }) {
  return (
    <div className="game-menu">
      <h3>Select a Game</h3>
      {games.map((game) => (
        <button
          key={game.id}
          className="arcade-button"
          onClick={() => onSelectGame(game.id)}
        >
          {game.name}
        </button>
      ))}
    </div>
  );
}

export default GameMenu;