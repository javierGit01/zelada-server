'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const groupSchema = new Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String, required: true, unique: true },
  bloqued: { type: Boolean }
});

module.exports = mongoose.model('Group', groupSchema);
