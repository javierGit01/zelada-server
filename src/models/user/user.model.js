'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Clients = require('./../client/client.model.js');
const Zone = require('./../zone/zone.model.js');

const userSchema = new Schema({
  fullname: { type: String, required: true },
  nickname: { type: String, required: true, unique: true },
  email: String,
  phone: String,
  password: { type: String, required: true },
  rule: { type: Number, required: true },
  address: String,
  available: Boolean,
  client: { type: Schema.ObjectId, ref: "client", required: false },
  zone: Number,
  deleted: { type: Boolean, default: false }
});

module.exports = mongoose.model('User', userSchema);
