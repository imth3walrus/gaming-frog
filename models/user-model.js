const mongoose = require('mongoose');
const autopopulate = require ('mongoose-autopopulate');
const Game = require('./game-model.js');

const Schema = mongoose.Schema;

const userSchema = new Schema({
  first_name: { type: String },
  last_name: { type: String },
  age: Number,
  country: String,
  state: String,
  city: String,
  console: {
    type: String,
    enum: [ 'xbox one', 'ps4', 'both']
  },
  xbox_gamertag: String,
  psn_id: String,
  email: String,
  username: { type: String },
  encryptedPassword: { type: String },
  role: {
      type: String,
      enum: [ 'normal user', 'admin' ],
      default: 'normal user'
    },
  pic_path: { type: String, default: "/img/profile-blank.png"},
  pic_name: String,
  facebookID: String,
  googleID: String,
  funds: {
    type: Number,
    default: 0
  },
  gf_coins: {
    type: Number,
    deault: 5,
  },
  level: {
    type: Number,
    default: 0
  },
  // games: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Game', autopopulate: true }],
  certify_age: {
    type: Boolean,
    default: true
  },
  certify_terms: {
    type: Boolean,
    default: true
  },
  payment_method: String,
  paypal_token: String,
},

{
  timestamps: true
}

);

userSchema.plugin(autopopulate);
const User = mongoose.model('User', userSchema);

module.exports = User;
