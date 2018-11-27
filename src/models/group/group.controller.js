'use strict';
const Groups = require('./group.model.js');
const Items = require('../item/item.model.js');
const GroupsDetail = require('./../group-detail/groupdetail.model.js');
const Token = require('../../config/token.js');
const jwt = require('../../middleware/jwt.js');
const NOT_FOUND_ERROR = 'Error Not Found - Group can not be found';

/*GroupDetail*/
// function getGroupsDetail (req, res) {
//   console.log('Detalle de grupos')
//   return GroupsDetail.find()
//   .then(groupList => {
//     Items.populate(groupList, { path: "item" }).
//     then(listItems =>
//       Groups.populate(listItems, { path: "group" })
//       .then(listItems => res.send({ data: listItems }))
//     )
//   })
//   .catch(error => { res.status(404).send({ data: error }); });
// }

// function postItemGroupDetail (req, res) {
//   console.log('Detalle de Grupo', req.body);
//   return GroupsDetail.create(req.body)
//   .then(() => res.send({ data: 'Group has been created' }))
//   .catch(error => res.status(500).send({ data: error }));
// }

// function updatePriceGroupDetailByItem (req, res) {
//   console.log('Detalle de Grupo', req.body);
//   return GroupsDetail.update(req.body)
//     .then(() => res.send({ data: 'Group has been created' }))
//     .catch(error => res.status(500).send({ data: error }));
// }

/*Group*/
function get (req, res) {
  console.log('Invoking group[get]');
  return Groups.find()
  .then(groupList => res.send({ data: groupList }))
  .catch(error => { res.status(404).send({ data: error }); });
}

function getById (req, res) {
  console.log('Invoking group[getById]');
  return Groups.findById({ _id: req.params.id })
    .then(group => {
      res.send({ data: group });
    })
    .catch(error => res.status(404).send({ data: error }));
}

function getByStatus (req, res) {
  console.log('Invoking group[getByStatus]');
  console.log(req.params.quantity, 'Esta es la cantidad de groups');
  return Groups.find({ bloqued: req.params.status }).limit(parseInt(req.params.quantity))
    .then(groupList => {
      res.send({ data: groupList });
    })
    .catch(error => res.status(404).send({ data: error }));
}

function updateStatus (req, res) {
  console.log('Invoking group[updateStatus]');
  let group = req.body;
  return Groups.findOneAndUpdate({ _id: group._id }, { $set: {
      bloqued: group.bloqued
    }
  }, { new: true })
  .then(group => {
    res.send({ data: group });
  })
  .catch(error => res.status(404).send({ data: error }));
}

function update (req, res) {
  console.log('Invoking group[update]');
  let group = req.body;
  return Groups.findOneAndUpdate({ _id: group._id }, { $set: {
        name: group.name,
        description: group.description
      }
    }, { new: true })
    .then(group => {
      res.send({ data: group });
    })
    .catch(error => res.status(404).send({ data: error }));
}

function post (req, res) {
  console.log('Invoking group[post]');
  return Groups.create(req.body)
  .then((group) => res.send({ data: {message:'Item has been created', group: group} }))
  .catch(error => res.status(500).send({ data: error }));
}

function remove (req, res) {
  console.log('Invoking group[remove]');
  return Groups.remove({ _id: req.params.id })
    .then(() => res.send({ data: 'Groups has been deleted' }))
    .catch(error => res.status(403).send({ data: error }));
}

function getItemsByGroupId (req, res) {
  console.log('Invoking group[getItemsByGroupId]');
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

module.exports = { post, get, remove, getById, update, updateStatus, getByStatus, getItemsByGroupId};

