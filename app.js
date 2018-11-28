/* eslint-disable no-console */
/*eslint no-return-assign: "error"*/
'use strict';
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const usersRoute = require('./src/models/user/user.route.js');
const clientsRoute = require('./src/models/client/client.route.js');
const itemsRoute = require('./src/models/item/item.route.js');
const groupsRoute = require('./src/models/group/group.route.js');
const priceRoute = require('./src/models/group-detail/groupdetail.route.js');
const orderRoute = require('./src/models/orders/order.route.js');
const prodorderRoute = require('./src/models/prodorders/prodorder.route.js');
const dateparamRoute = require('./src/models/dateparam/dateparam.route.js');
const timeparamRoute = require('./src/models/timeparam/timeparam.route.js');
const zoneRoute = require('./src/models/zone/zone.route.js');
const mongoose = require('mongoose');
const cors = require('cors');
const utf8 = require('utf8');
const db = require('./src/config/db');
const fileUpload = require('express-fileupload');
app.use(fileUpload());

// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(bodyParser.json());


const PORT = process.env.PORT || 3333;
const router = express.Router();
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
app.use(cors());

app.use('/user', usersRoute);
app.use('/client', clientsRoute);
app.use('/item', itemsRoute);
app.use('/group', groupsRoute);
app.use('/price', priceRoute);
app.use('/order', orderRoute);
app.use('/prodorder', prodorderRoute);
app.use('/dateparam', dateparamRoute);
app.use('/timeparam', timeparamRoute);
app.use('/zone', zoneRoute);
app.use('/', router);

mongoose.Promise = global.Promise;
mongoose.connect(db.url, err => {
  if (err) {
    throw new Error('Unable to connect to Mongo.');
  } else {
    app.listen(PORT, () => {
      console.log(`Connected at server - port ${PORT}`);
    }); 
  }
});

// CONNECTION EVENTS
// When successfully connected
mongoose.connection.on('connected', () => {
  console.log(`Mongoose default connection open to ${db.url}`);
});

// If the connection throws an error
mongoose.connection.on('error', err => {
  console.log(`Mongoose default connection error: ${err}`);
});

// When the connection is disconnected
mongoose.connection.on('disconnected', () => {
  console.log('Mongoose default connection disconnected');
});

// If the Node process ends, close the Mongoose connection
process.on('SIGINT', () => {
  mongoose.connection.close(() => {
    throw new Error('Mongoose default connection disconnected through app termination.');
  });
});
