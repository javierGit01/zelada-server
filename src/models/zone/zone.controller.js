'use strict';
const Zones = require('./zone.model.js');
const Items = require('../item/item.model.js');
const Token = require('../../config/token.js');
const jwt = require('../../middleware/jwt.js');
const NOT_FOUND_ERROR = 'Error Not Found - Zone can not be found';

/*Zone*/
function get (req, res) {
  console.log('Invoking zone[get]');
  return Zones.find({
    bloqued: false
  })
  .then(zoneList => res.send({
    message: 'Zones List retrieved',
    data: zoneList
  }))
  .catch(error => { res.status(404).send({ data: error }); });
}

function getById (req, res) {
  console.log('Invoking zone[getById]');
  return Zones.findById({ _id: req.params.id })
    .then(zone => {
      res.send({
        message: 'The zone was found',
        data: zone
      });
    })
    .catch(error => res.status(404).send({ data: error }));
}

function getByStatus (req, res) {
  console.log('Invoking zone[getByStatus]');
  console.log(req.params.quantity, 'Esta es la cantidad de zones');
  return Zones.find({ bloqued: req.params.status }).limit(parseInt(req.params.quantity))
    .then(zoneList => {
      res.send({ data: zoneList });
    })
    .catch(error => res.status(404).send({ data: error }));
}

function updateStatus (req, res) {
  console.log('Invoking zone[updateStatus]');
  let zone = req.body;
  return Zones.findOneAndUpdate({ _id: zone._id }, { $set: {
      bloqued: zone.bloqued
    }
  }, { new: true })
  .then(zone => {
    res.send({ data: zone });
  })
  .catch(error => res.status(404).send({ data: error }));
}

function update (req, res) {
  console.log('Invoking zone[update]');
  let zone = req.body;
  return Zones.findOneAndUpdate({ _id: zone._id }, { $set: {
        name: zone.name,
        description: zone.description
      }
    }, { new: true })
    .then(zone => {
      res.send({ data: zone });
    })
    .catch(error => res.status(404).send({ data: error }));
}

function post (req, res) {
  console.log('Invoking zone[post]');
  return Zones.create(req.body)
  .then((zone) => res.send({ data: {message:'Item has been created', zone: zone} }))
  .catch(error => res.status(500).send({ data: error }));
}

function remove (req, res) {
  console.log('Invoking zone[remove]');
  return Zones.remove({ _id: req.params.id })
    .then(() => res.send({ data: 'Zones has been deleted' }))
    .catch(error => res.status(403).send({ data: error }));
}

module.exports = { post, get, remove, getById, update, updateStatus, getByStatus};

