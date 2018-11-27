'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var ItemOrder = new Schema({
  group: { type: Schema.ObjectId, ref: "group" },
  price: { type: Number, min: 0, required: true }
});

const itemSchema = new Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String, required: true, unique: true },
  code: { type: String, required: true, unique: true },
  kind: { type: Number, required: true },
  unit: { type: String, required: true },
  filepath: { type: String },
  image: { type: String },
  resgisterdate: { type: Date },
  groupsprices: [ ItemOrder ],
  available: { type: Boolean },
  deleted: { type: Boolean, default: false }
});

module.exports = mongoose.model('Item', itemSchema);
