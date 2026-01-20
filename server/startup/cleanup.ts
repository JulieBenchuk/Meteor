import { Meteor } from 'meteor/meteor';
import { Games } from '/imports/collections/Games';

Meteor.startup(async () => {
  const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
  await Games.removeAsync({ createdAt: { $lt: oneDayAgo } });
  
  Meteor.setInterval(async () => {
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    await Games.removeAsync({ createdAt: { $lt: oneDayAgo } });
  }, 6 * 60 * 60 * 1000);
});