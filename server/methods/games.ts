import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Games } from '/imports/collections/Games';
import { checkWinner } from '/imports/utils/gameLogic';

Meteor.methods({
  async 'games.create'() {
    if (!this.userId) {
      throw new Meteor.Error('not-authorized', 'You must be logged in to create a game');
    }

    const gameId = await Games.insertAsync({
      board: Array(9).fill(null),
      currentPlayer: 'X',
      status: 'waiting',
      createdBy: this.userId,
      createdAt: new Date(),
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

    await Games.updateAsync({ _id: gameId }, { 
        $set: { 
          board: newBoard, 
          currentPlayer: nextPlayer 
        } 
      });

    return await Games.findOneAsync({ _id: gameId });
  },
  async 'games.getStats'() {
    if (!this.userId) {
        throw new Meteor.Error('not-authorized', 'You must be logged in to create a game');
      }
      const userId = this.userId;
      const totalGames = await Games.find({ createdBy: userId }).countAsync();

      const wins = await Games.find({ 
        createdBy: userId, 
        status: 'finished', 
        winner: 'X'
      }).countAsync();

      const losses = await Games.find({ 
        createdBy: userId, 
        status: 'finished', 
        winner: { $ne: 'X' }
      }).countAsync();

      const lastGame = await Games.findOneAsync(
        { createdBy: userId },
        { sort: { createdAt: -1 } }
      );

      return {
        totalGames,
        wins,
        losses,
        lastGame,
      };
    },
    async 'games.getLeaderboard'() {
        const finishedGames = await Games.find({ 
          status: 'finished',
          winner: { $ne: 'draw' }
        }).fetchAsync();
        
        const stats: Record<string, { userId: string; wins: number }> = {};
        
        for (const game of finishedGames) {
          if (!game.createdBy || !game.winner) continue;
          
          if (!stats[game.createdBy]) {
            stats[game.createdBy] = { userId: game.createdBy, wins: 0 };
          }
          
          stats[game.createdBy].wins += 1;
        }
        
        const leaderboard = Object.values(stats)
          .sort((a, b) => b.wins - a.wins)
          .slice(0, 10);
        
        return leaderboard;
      }
});
