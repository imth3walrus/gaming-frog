const mongoose = require('mongoose');
const autopopulate = require ('mongoose-autopopulate');
const User = require('./user-model.js');
const Escrow = require('./escrow-model.js');
const Chat = require('./chat-model.js');

const Schema = mongoose.Schema;

const gameSchema = new Schema({
  match_type: {
    type: String,
    default: 'public',
    enum: ['public', 'private']
  },
  match_status: {
    type: String,
    default: 'open',
    enum: ['open', 'disputed', 'completed', 'joined']
  },
  console: {
    type: String,
    enum: ['xbox one', 'ps4']
  },
  half_lenght: {
    type: Number,
    default: 5,
    enum: [ 5, 6, 7, 8, 9, 10]
  },
  teams: {
    type: String,
    default: 'any',
    enum: ['club', 'any', 'national', 'women']
  },
  teams_level: {
    type: Number,
    default: 5,
    enum: [1, 2, 3, 4, 5]
  },
  fifa_version: {
    type: Number,
    default: 17,
    enum: [16, 17]
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    autopopulate: true
  },
  opponent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    autopopulate: true
  },
  bet: Number,
  escrow: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Escrow',
    autopopulate: true
  },
  chat: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Chat',
    autopopulate: true
  },
  score_owner: Number,
  score_opponent: Number


},

{
  timestamps: true
}

);

gameSchema.plugin(autopopulate);

const Game = mongoose.model('Game', gameSchema);

module.exports = Game;
