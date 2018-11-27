'use strict';
const Items = require('./item.model.js');
const Groups = require('./../group/group.model.js');
const GroupsDetail = require('./../group/group-detail.model.js');
const Token = require('../../config/token.js');
const jwt = require('../../middleware/jwt.js');
const NOT_FOUND_ERROR = 'Error Not Found - Item can not be found';

function get (req, res) {
  return Items.find()
  .then(itemList => res.send({ data: itemList }))
  .catch(error => { res.status(404).send({ data: error }); });
}

function getById (req, res) {
  return Items.findById(req.params._id)
    .then(item => {
      res.send({ data: item });
    })
    .catch(error => res.status(404).send({ data: error }));
}

function getByStatus (req, res) {
  console.log(req.params.quantity, 'Esta es la cantidad de items');
  return Items.find({ bloqued: req.params.status }).limit(parseInt(req.params.quantity))
    .then(itemList => {
      res.send({ data: itemList });
    })
    .catch(error => res.status(404).send({ data: error }));
}

function updateStatus (req, res) {
  let item = req.body;
  return Items.findOneAndUpdate({ _id: item._id }, { $set: {
      bloqued: item.bloqued
    }
  }, { new: true })
  .then(item => {
    res.send({ data: item });
  })
  .catch(error => res.status(404).send({ data: error }));
}

function update (req, res) {
  console.log('Actualizando estado de Item');
  let item = req.body;
  return Items.findOneAndUpdate({ _id: req.params.id }, { $set: {
        name: item.name,
        code: item.code,
        kind: item.kind,
        unit: item.unit,
        bloqued: item.bloqued
      }
    }, { new: true })
    .then(item => {
      res.send({ data: item });
    })
    .catch(error => res.status(404).send({ data: error }));
}

function post (req, res) {
  console.log('Creating item:...');
  return Items.create(req.body)
  .then(() => res.send({ data: 'Item has been created' }))
  .catch(error => res.status(500).send({ data: error }));
}

function remove (req, res) {
  return Items.remove({ _id: req.params.id })
    .then(() => res.send({ data: 'Item has been deleted' }))
    .catch(error => res.status(403).send({ data: error }));
}

function postItemGroup (req, res) {
  let item = req.body;
  let groups = req.body.groups;
  // post(item, res);
  Items.create(item)
    .then((result) => {
      groups.forEach(itemGroup => {
        itemGroup.item = result._id;
        console.log('Nuevo Grupo relacionado:...', itemGroup);
        return GroupsDetail.create(itemGroup);
      });
    })
    .then(() => res.send({ data: 'Group has been created' }))
    .catch(error => res.status(500).send({ data: error }));
}

function getGroupsByItemId (req, res) {
  console.log('Obteniendo detalle grupos por item id:...', req.params.id);
  return GroupsDetail.find({ item: req.params.id })
    .then(groupList => {
      Items.populate(groupList, {path: "item"}).
      then(listItems =>
        Groups.populate(listItems, {path: "group"})
          .then(listItems => res.send({ data: listItems }))
      );
    })
    .catch(error => res.status(404).send({ data: error }));
}

module.exports = { post, postItemGroup, get, getById, update, updateStatus, getByStatus, remove, getGroupsByItemId };
