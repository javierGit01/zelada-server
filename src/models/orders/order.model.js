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
  price: { type: Number, min: 0, required: true },
  devolution: { type: Number, min: 0 },
  delivery: { type: Number, min: 0 },
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
  client: { type: Schema.ObjectId, ref: "client" },
  itemsorder: [ ItemOrder ],
  deliverydate: { type: Date },
  // deliveryhour: { TimeC },
  orderdate: { type: Date },
  observation: { type: String },
  user: { type: Schema.ObjectId, ref: "user", required: true },
  status: { type: Number, default: 1 } //1=PENDIENTE, 2=APROBADO, 3=ANULADO
});

order.plugin(autoIncrement.plugin, "Order");
module.exports = mongoose.model('Order', order);
