'use strict';
const Groups = require('./../group/group.model.js');
const Zones = require('./../zone/zone.model.js');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const clientSchema = new Schema({
  fullname: { type: String, required: false },
  nickname: { type: String, required: true, unique: true },
  email: String,
  phone: String,
  nametoinvoice: String,
  group : { type: Schema.ObjectId, ref: "Group" },
  zone : Number,
  nit: { type: String, required: true, unique: true },
  address: String,
  available: Boolean,
  user : { type : Schema.ObjectId, ref: 'User' },
  lat : Number,
  lng : Number
});

module.exports = mongoose.model('Client', clientSchema);
