import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Games } from '/imports/collections/Games';

Meteor.publish('games', function () {
  return Games.find();
});

Meteor.publish('game', function (gameId: string) {
  if (!gameId) {
    return this.ready();
  }
  check(gameId, String);
  const game = Games.findOne({ _id: gameId });
  if (game && game.createdBy) {
    return [
      Games.find({ _id: gameId }),
      Meteor.users.find({ _id: game.createdBy }, { fields: { emails: 1 } }),
    ];
  }
  return Games.find({ _id: gameId });
});
