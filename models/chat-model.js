const mongoose = require('mongoose');
const User = require('./user-model.js');
const autopopulate = require ('mongoose-autopopulate');

const Schema = mongoose.Schema;

const chatSchema = new Schema({
  message: [{
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      autopopulate: true
    },
    content: String
  }]
},

{
  timestamps: true
}

);

chatSchema.plugin(autopopulate);
const Chat = mongoose.model('Chat', chatSchema);

module.exports = Chat;
