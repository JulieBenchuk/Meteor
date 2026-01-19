import React, { useState, useEffect } from 'react';
import { useTracker } from 'meteor/react-meteor-data';
import { Games } from '../collections/Games';
import { useSubscribe } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';

export const GameBoard = () => {
  useSubscribe('games');
  const [gameId, setGameId] = useState<string | null>(null);

  useEffect(() => {
    if (gameId) return;
    
    Meteor.call('games.create', (error: any, result: string) => {
      if (error) {
        console.error('Error creating game:', error);
      } else {
        setGameId(result);
      }
    });
  }, [gameId]);

  const game = useTracker(() => {
    if (!gameId) return null;
    return Games.findOne({_id: gameId});
  });

  const handleCellClick = (index: number) => {
    if (!game || !game._id || game.board[index] !== null) {
      return;
    }
  
    Meteor.call('games.makeMove', game._id, index, (error: any) => {
      if (error) {
        console.error('Error making move:', error);
        alert(error.message || 'Failed to make move');
      }
    });
  };

  if (!game) {
    return <div>Loading...</div>;
  }

  return (
    <div
      style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '4px', width: '300px' }}
    >
      {game.board.map((cell, index) => (
        <button
          key={index}
          onClick={() => handleCellClick(index)}
          style={{
            width: '100px',
            height: '100px',
            fontSize: '24px',
            border: '1px solid #ccc',
            cursor: cell === null ? 'pointer' : 'not-allowed',
            backgroundColor: cell === null ? 'white' : '#f0f0f0',
          }}
        >
          {cell || ''}
        </button>
      ))}
    </div>
  );
};
