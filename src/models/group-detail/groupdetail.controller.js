'use strict';
const Items = require('../item/item.model.js');
const Groups = require('../group/group.model.js');
const GroupsDetail = require('../group-detail/groupdetail.model');
const Token = require('../../config/token.js');
const jwt = require('../../middleware/jwt.js');
const NOT_FOUND_ERROR = 'Error Not Found - Item can not be found';

function get (req, res) {
  console.log('Detalle de grupos')
  return GroupsDetail.find()
    .then(groupList => {
      Items.populate(groupList, { path: "item" }).
      then(listItems =>
        Groups.populate(listItems, { path: "group" })
          .then(listItems => res.send({ data: listItems }))
      )
    })
    .catch(error => { res.status(404).send({ data: error }); });
}

function getById (req, res) {
  console.log(req.params, '---------------------ID_PRICE');
  return GroupsDetail.findById({ _id: req.params.id })
    .then(groupList => {
      Items.populate(groupList, { path: "item" }).
      then(listItems =>
        Groups.populate(listItems, { path: "group" })
          .then(listItems => res.send({ data: listItems }))
      )
    })
    .catch(error => res.status(404).send({ data: error }));
}

function update (req, res) {
  console.log('Actualizando estado de Item');
  let groupsDetail = req.body;
  return GroupsDetail.findOneAndUpdate({ _id: req.params.id }, { $set: {
        item: groupsDetail.item,
        price: groupsDetail.price,
        group: groupsDetail.group,
      }
    }, { new: true })
    .then(item => {
      res.send({ data: item });
    })
    .catch(error => res.status(404).send({ data: error }));
}

function post (req, res) {
  console.log('Creating group-detail:...');
  let detail = {
    item: req.body.item._id,
    group: req.body.group._id,
    price: req.body.price
  };
  let canCreate = false;
  return GroupsDetail.findOne({item: detail.item, group: detail.group})
    .then((some)=>{
      if(some === null){
        return GroupsDetail.create(req.body)
          .then(() => res.send({ data: 'El precio fue creado' }));
      }
      throw new Error('Esta relacion de precio ya existe');
    }).
    catch(error => res.status(500).send({ data: error }));
}

function remove (req, res) {
  return GroupsDetail.remove({ _id: req.params.id })
    .then(() => res.send({ data: 'El precio se ah eliminado' }))
    .catch(error => res.status(403).send({ data: error }));
}

function deleteDetaillGroupsByItemId (req, res) {
  console.log('Obteniendo detalle grupos por item id -> PARA ELIMINAR:...', req.params.id);
  return GroupsDetail.find({ item: req.params.id })
    .then(groupList => {
      GroupsDetail.remove({ _id: groupList._id })
        .then(() => res.send({ data: 'El precio se ah eliminado' }))
        .catch((error) => {
          throw error;
        })
    })
    .catch(error => res.status(404).send({ data: error }));
}

function deleteDetaillGroupsByGroupId (req, res) {
  console.log('Obteniendo detalle grupos por item id -> PARA ELIMINAR:...', req.params.id);
  return GroupsDetail.find({ group: req.params.id })
    .then(groupList => {
      GroupsDetail.remove({ _id: groupList._id })
        .then(() => res.send({ data: 'El precio se ah eliminado' }))
        .catch((error) => {
          throw error;
        })
    })
    .catch(error => res.status(404).send({ data: error }));
}

function postItemGroup (req, res) {
  let item = req.body;
  let groups = req.body.groups;
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

// function postItemGroupDetail (req, res) {
//   console.log('Detalle de Grupo', req.body);
//   return GroupsDetail.create(req.body)
//   .then(() => res.send({ data: 'Group has been created' }))
//   .catch(error => res.status(500).send({ data: error }));
// }

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

function getItemsByGroupId (req, res) {
  console.log('Obteniendo detalle items por grupo id:...', req.params.id);
  return GroupsDetail.find({ group: req.params.id })
    .then(groupList => {
      Items.populate(groupList, {path: "item"}).
      then(listItems =>
        Groups.populate(listItems, {path: "group"})
          .then(listItems => res.send({ data: listItems }))
      );
    })
    .catch(error => res.status(404).send({ data: error }));
}

module.exports = { post, postItemGroup, get, getById, update, remove, getGroupsByItemId, getItemsByGroupId, deleteDetaillGroupsByItemId, deleteDetaillGroupsByGroupId };
