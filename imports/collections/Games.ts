import { Mongo } from 'meteor/mongo';
import { Game } from '../types/Game';

export const Games = new Mongo.Collection<Game>('games');
