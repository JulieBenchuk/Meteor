import React, { useState } from 'react';
import { useTracker } from 'meteor/react-meteor-data';
import { useSubscribe } from 'meteor/react-meteor-data';
import { Games } from '../collections/Games';
import { GameBoard } from './GameBoard';

export const GameList = () => {
  useSubscribe('games');
  const games = useTracker(() => Games.find().fetch());
  const [selectedGameId, setSelectedGameId] = useState<string | null>(null);

  if (selectedGameId) {
    return (
      <div>
        <button onClick={() => setSelectedGameId(null)}>← Back to list</button>
        <GameBoard gameId={selectedGameId} />
      </div>
    );
  }

  return (
    <div>
      <h2>All Games</h2>
      {games.length === 0 ? (
        <p>No games yet. Create a new game!</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {games.map((game) => (
            <li
              key={game._id}
              onClick={() => setSelectedGameId(game._id!)}
              style={{
                padding: '10px',
                margin: '5px 0',
                border: '1px solid #ccc',
                cursor: 'pointer',
                borderRadius: '4px',
              }}
            >
              <div>Game ID: {game._id}</div>
              <div>Status: {game.status}</div>
              {game.winner && <div>Winner: {game.winner}</div>}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
