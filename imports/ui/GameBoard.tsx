import React, { useState } from 'react';

export const GameBoard = () => {
  const [board, setBoard] = useState<(string | null)[]>(Array(9).fill(null));
  const [currentPlayer, setCurrentPlayer] = useState<'X' | 'O'>('X');

  const handleCellClick = (index: number) => {
    if (board[index] !== null) {
      return;
    }

    const newBoard = [...board];
    newBoard[index] = currentPlayer;
    setBoard(newBoard);
    setCurrentPlayer(currentPlayer === 'X' ? 'O' : 'X');
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '4px', width: '300px' }}>
      {board.map((cell, index) => (
        <button
          key={index}
          onClick={() => handleCellClick(index)}
          style={{
            width: '100px',
            height: '100px',
            fontSize: '24px',
            border: '1px solid #ccc',
            cursor: cell === null ? 'pointer' : 'not-allowed',
            backgroundColor: cell === null ? 'white' : '#f0f0f0'
          }}
        >
          {cell || ''}
        </button>
      ))}
    </div>
  );
};