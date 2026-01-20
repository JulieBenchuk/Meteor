import { Meteor } from 'meteor/meteor';
import { Games } from '/imports/collections/Games';

Meteor.startup(() => {
  Games.createIndex({ status: 1 });
  
  Games.createIndex({ createdBy: 1 });
  
  Games.createIndex({ status: 1, createdAt: 1 });
});