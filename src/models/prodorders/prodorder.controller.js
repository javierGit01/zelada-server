'use strict';
const ProdOrders = require('../prodorders/prodorder.model.js');
const Items = require('../item/item.model.js');
const Users = require('../user/user.model.js');
const Orders = require('../orders/order.model.js');
const Clients = require('../client/client.model.js');
const Groups = require('../group/group.model.js');
const Token = require('../../config/token.js');
const jwt = require('../../middleware/jwt.js');
const NOT_FOUND_ERROR = 'Error Not Found - Item can not be found';
const moment = require('moment-timezone');
const { TIME_ZONE, ORDER_PENDING, ORDER_APROVED, ORDER_CANCELED, ORDER_DELIVERED, statusListOrder, ONESIGNAL_APP_ID, REST_API_KEY, URL_STATUS_ORDER_REDIRECT } = require('../../config/constant.js');
var OneSignal = require('onesignal-node');

function get (req, res) {
  return ProdOrders.find({}, {}, { sort:{
      orderdate: -1 //Sort by Date Added DESC
    } })
    .then(userList => {
      Items.populate(userList, { path: "itemsorder.item", model: 'Item', select: '-image' }).
      then(listItems => {
        Clients.populate(listItems, { path: "client" })
          .then(listItems => {
            Groups.populate(listItems, { path: "client.group", model: 'Group' })
              .then(listItems => {
                Users.populate(listItems, {path: "user", model: 'User'})
                  .then(listItems => res.send({data: listItems}))
              })
          })
      })
    })
    .catch(error => res.status(404).send({ data: error }));
}

function getById (req, res) {
  return ProdOrders.findById({ _id: req.params.id })
    .then(userList => {
      Items.populate(userList, { path: "itemsorder.item", model: 'Item', select: '-image'}).
      then(listItems => {
        Clients.populate(listItems, { path: "client", model: 'Client' })
          .then(listItems => {
            Groups.populate(listItems, { path: "client.group", model: 'Group' })
              .then(listItems => {
                Users.populate(listItems, {path: "user", model: 'User'})
                  .then(listItems => res.send({data: listItems}))
              })
          })
      })
    })
    .catch(error => res.status(404).send({ data: error }));
}

function getByUserId (req, res) {
  return ProdOrders.find({ user: req.params.id }, {}, { sort:{ orderdate: -1 } })
    .then(userList => {
      Items.populate(userList, { path: "itemsorder.item", model: 'Item',  select: '-image' }).
      then(listItems => {
        Clients.populate(listItems, { path: "client", model: 'Client' })
          .then(listItems => {
            Groups.populate(listItems, { path: "client.group", model: 'Group' })
              .then(listItems => {
                Users.populate(listItems, {path: "user", model: 'User'})
                  .then(listItems => res.send({data: listItems}))
              })
          })
      })
    })
    .catch(error => res.status(404).send({ data: error }));
}

function getByClientId (req, res) {
  return ProdOrders.find({ client: req.params.id }, {}, { sort:{ orderdate: -1 } })
    .then(userList => {
      Items.populate(userList, { path: "itemsorder.item", model: 'Item' , select: '-image'}).
      then(listItems => {
        Clients.populate(listItems, { path: "client" })
          .then(listItems => {
            Groups.populate(listItems, { path: "client.group", model: 'Group' })
              .then(listItems => {
                Users.populate(listItems, {path: "user"})
                  .then(listItems => res.send({data: listItems}))
              })
          })
      })
    })
    .catch(error => res.status(404).send({ data: error }));
}


function update (req, res) {
  var newOrder = req.body;
  return ProdOrders.findOneAndUpdate({ _id: req.params.id }, { $set: newOrder }, { new: true })
    .then(item => {
      Users.populate(item, {path: "user", model: 'User'})
        .then(listItems => {
          Clients.populate(listItems, { path: "client" })
            .then(itemClient => {
              if (newOrder.status === ORDER_DELIVERED) {
                var orderStatus = statusListOrder.find(itemStatus => itemStatus.id === ORDER_DELIVERED).text;
                var customMessage = 'Su Pedido para ' + itemClient.client.fullname + ' fue ' + orderStatus;
                var message = {
                  app_id: ONESIGNAL_APP_ID,
                  contents: {"en": customMessage},
                  url: URL_STATUS_ORDER_REDIRECT,
                  filters: [
                    {"field": "email", "relation": "=", "value": itemClient.user.email}
                  ]
                };
                sendNotification(message);
              }
              res.send({data: itemClient});
            })
            .catch(error => { throw error; })
        })
        .catch(error => { throw error; })
    })
    .catch(error => res.status(404).send({ data: error }));
}

var sendNotification = function(data) {
  var headers = {
    "Content-Type": "application/json; charset=utf-8",
    "Authorization": "Basic " + REST_API_KEY
  };

  var options = {
    host: "onesignal.com",
    port: 443,
    path: "/api/v1/notifications",
    method: "POST",
    headers: headers
  };

  var https = require('https');
  var req = https.request(options, function(res) {
    res.on('data', function(data) {
      console.log("Response:");
      console.log(JSON.parse(data));
    });
  });

  req.on('error', function(e) {
    console.log("ERROR:");
    console.log(e);
  });

  req.write(JSON.stringify(data));
  req.end();
};

function updateStatus (req, res) {
  console.log('Actualizando estado de Item');
  var status = req.body.status;
  return ProdOrders.findOneAndUpdate({ _id: req.params.id }, { $set: { status } }, { new: true })
    .then(item => {
      res.send({ data: item });
    })
    .catch(error => res.status(404).send({ data: error }));
}

function post (req, res) {
  req.body.orderdate = moment.tz(new Date(), TIME_ZONE).format();
  return ProdOrders.create(req.body)
    .then(() => res.send({ data: 'El pedido fue creado' }))
    .catch(error => res.status(500).send({ data: error }));
}

function remove (req, res) {
  return ProdOrders.remove({ _id: req.params.id })
    .then(() => res.send({ data: 'El precio se ah eliminado' }))
    .catch(error => res.status(403).send({ data: error }));
}

function getBasicReport (req, res) {
  console.log('Invoking orders[getBasicReport]');
  var currentDate = moment().startOf('day');
  var tomorrow = moment(currentDate).endOf('day');
  return ProdOrders.find({ deliverydate: {
      $gte: currentDate.toDate(),
      $lt: tomorrow.toDate()
    } }, {}, { sort:{ deliverydate: -1 } })
    .then(orderList => {
      res.send({data: orderList});
    })
    .catch(error => res.status(404).send({ data: error }));
}
function getBasicReportTomorow (req, res) {
  console.log('Invoking orders[getBasicReportTomorow]');
  var currentDate = moment().startOf('day');
  var tomorrow = moment(new Date()).add(1,'days');
  var tomorrowNext = moment(new Date()).add(2,'days');
  return ProdOrders.find({ deliverydate: {
      $gte: currentDate.toDate(),
      $lt: tomorrow.toDate()
    } }, {}, { sort:{ deliverydate: -1 } })
    .then(orderList => {
      res.send({data: orderList});
    })
    .catch(error => res.status(404).send({ data: error }));
}

module.exports = { post, get, getById, getByUserId, getByClientId, update, updateStatus, remove, getBasicReport, getBasicReportTomorow };
