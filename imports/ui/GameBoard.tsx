import React, { useState, useEffect } from 'react';
import { useTracker } from 'meteor/react-meteor-data';
import { Games } from '../collections/Games';
import { useSubscribe } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';

interface GameBoardProps {
  gameId?: string | null;
}

export const GameBoard = ({ gameId: propGameId }: GameBoardProps = {}) => {
  const [gameId, setGameId] = useState<string | null>(propGameId || null);

  useEffect(() => {
    if (propGameId) {
      setGameId(propGameId);
      return;
    }
    if (gameId) return;
    
    Meteor.call('games.create', (error: any, result: string) => {
      if (error) {
        console.error('Error creating game:', error);
      } else {
        setGameId(result);
      }
    });
  }, [gameId, propGameId]);

  if (!gameId) {
    return <div>Creating game...</div>;
  }

  useSubscribe('game', gameId);
  const game = useTracker(() => {
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
    return <div>Loading game...</div>;
  }

  const creator = useTracker(() => {
    if (!game.createdBy) return null;
    return Meteor.users.findOne({ _id: game.createdBy });
  });

  return (
    <div>
      <div style={{ marginBottom: '15px' }}>
        {creator && (
          <div style={{ marginBottom: '5px' }}>
            <strong>Created by:</strong> {creator.emails?.[0]?.address || 'Unknown'}
          </div>
        )}
        <div>
          <strong>Current player:</strong> {game.currentPlayer}
        </div>
        {game.status === 'finished' && game.winner && (
          <div style={{ marginTop: '5px', color: '#28a745', fontWeight: 'bold' }}>
            Winner: {game.winner === 'draw' ? 'Draw!' : game.winner}
          </div>
        )}
      </div>
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
    </div>
  );
};
