const mongoose = require('mongoose');
const autopopulate = require ('mongoose-autopopulate');

const Schema = mongoose.Schema;

const escrowSchema = new Schema({
  total_funds: Number
},

{
  timestamps: true
}

);

escrowSchema.plugin(autopopulate);
const Escrow = mongoose.model('Escrow', escrowSchema);

module.exports = Escrow;
