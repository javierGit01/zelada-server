'use strict';
const mongoose = require('mongoose');
const autoIncrement = require('mongoose-auto-increment');
autoIncrement.initialize(mongoose.connection);
const Schema = mongoose.Schema;

const zoneScheme = new Schema({
  _id: {type: String, required: true},
  name: { type: String, required: true, unique: true },
  description: { type: String, required: true, unique: true },
  bloqued: { type: Boolean, default: false }
});
zoneScheme.plugin(autoIncrement.plugin, "Zone");
module.exports = mongoose.model('Zone', zoneScheme);
