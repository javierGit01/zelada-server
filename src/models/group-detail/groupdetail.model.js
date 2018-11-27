'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const group = mongoose.model('Group');
const item = mongoose.model('Item');

const groupDetailSchema = new Schema({
  group : { type: Schema.ObjectId, ref: "Group" },
  item : { type: Schema.ObjectId, ref: "item" },
  price: { type: Number, min: 0, required: true }
});

module.exports = mongoose.model('GroupDetail', groupDetailSchema);
