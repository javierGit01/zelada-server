'use strict';
const mongoose = require('mongoose');
const autoIncrement = require('mongoose-auto-increment');
autoIncrement.initialize(mongoose.connection);
const Schema = mongoose.Schema;
const client = mongoose.model('Client');
const item = mongoose.model('Item');

var ItemOrder = new Schema({
  item: { type: Schema.ObjectId, ref: "item" },
  quantity: { type: Number, min: 0, required: true },
  totalprice: { type: Number, min: 0, required: true },
  especification: { type: String }
});

var TimeC = new Schema({
  HH: { type: String },
  mm: { type: String },
  ss: { type: String }
});
const order = new Schema({
  _id: {type: String, required: true},
  seq: { type: Number, default: 1 },
  itemsorder: [ ItemOrder ],
  toproductiondate: { type: Date },
  registereddate: { type: Date },
  observation: { type: String },
  user: { type: Schema.ObjectId, ref: "user", required: true },
  status: { type: Number, default: 1 }, //1=PENDIENTE, 2=APROBADO, 3=ANULADO
  totalordered: { type: Number }
});

order.plugin(autoIncrement.plugin, "ProdOrder");
module.exports = mongoose.model('ProdOrder', order);
