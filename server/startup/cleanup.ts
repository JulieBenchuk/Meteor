import { Meteor } from 'meteor/meteor';
import { Games } from '/imports/collections/Games';

Meteor.startup(() => {
  const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
  Games.remove({ createdAt: { $lt: oneDayAgo } });
  
  Meteor.setInterval(() => {
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    Games.remove({ createdAt: { $lt: oneDayAgo } });
  }, 6 * 60 * 60 * 1000);
});