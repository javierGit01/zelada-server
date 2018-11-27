'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const timeParamSchema = new Schema({
  timerestrict: { type: Number, required: true },
  reason: { type: String, required: true }
});

module.exports = mongoose.model('TimeParam', timeParamSchema);
