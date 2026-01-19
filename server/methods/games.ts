import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Games } from '/imports/collections/Games';
import { checkWinner } from '/imports/utils/gameLogic';

Meteor.methods({
  async 'games.create'() {
    const gameId = await Games.insertAsync({
      board: Array(9).fill(null),
      currentPlayer: 'X',
      status: 'waiting',
    });
    return gameId;
  },

  async 'games.makeMove'(gameId: string, position: number) {
    check(gameId, String);
    check(position, Number);

    if (position < 0 || position > 8) {
      throw new Meteor.Error('invalid-position', 'Position must be between 0 and 8');
    }

    const game = await Games.findOneAsync({ _id: gameId });
    if (!game) {
      throw new Meteor.Error('game-not-found', 'Game not found');
    }

    if (game.status !== 'playing' && game.status !== 'waiting') {
      throw new Meteor.Error('game-finished', 'Game is already finished');
    }

    if (game.board[position] !== null) {
      throw new Meteor.Error('cell-occupied', 'Cell is already occupied');
    }

    const newBoard = [...game.board];
    newBoard[position] = game.currentPlayer;
    const nextPlayer = game.currentPlayer === 'X' ? 'O' : 'X';

    const winner = checkWinner(newBoard);

    const updateData: any = {
      board: newBoard,
      currentPlayer: nextPlayer,
    };

    if (winner) {
      updateData.status = 'finished';
      updateData.winner = winner;
    } else if (game.status === 'waiting') {
      updateData.status = 'playing';
    }

    await Games.updateAsync({ _id: gameId }, { $set: updateData });

    return await Games.findOneAsync({ _id: gameId });
  },
});
