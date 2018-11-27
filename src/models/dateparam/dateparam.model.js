'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const dateParamSchema = new Schema({
  daterestrict: { type: Date, required: true },
  reason: { type: String, required: true }
});

module.exports = mongoose.model('DateParam', dateParamSchema);
