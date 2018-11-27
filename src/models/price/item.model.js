'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const itemSchema = new Schema({
  name: { type: String, required: true, unique: true },
  code: { type: String, required: true, unique: true },
  kind: { type: String, required: true },
  unit: { type: String, required: true },
  bloqued: String
});

module.exports = mongoose.model('Item', itemSchema);
