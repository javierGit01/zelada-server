'use strict';
const Clients = require('./client.model.js');
const Groups = require('./../group/group.model.js');
const Users = require('./../user/user.model.js');
const Zones = require('./../zone/zone.model.js');
const Token = require('../../config/token.js');
const jwt = require('../../middleware/jwt.js');
const NOT_FOUND_ERROR = 'Error Not Found - User can not be found';

function get (req, res) {
  console.log('invoking client[get]');
  return Clients.find()
    .then(client => {
      Groups.populate(client, { path: "group" })
        .then(()=>{
          Users.populate(client, { path: "user" })
            .then(()=>{
              Zones.populate(client, { path: "zone" })
                .then(()=>{
                  res.send({ data: client });
                })
                .catch(error => { throw error });
            })
            .catch(error => { throw error });
        })
        .catch(error => { throw error });
    })
    .catch(error => res.status(404).send({ data: error }));
}
function getByNickname (req, res) {
  console.log('invoking client[getByNickname]');
  return Clients.find({ nickname: req.params.nickname })
    .then(userList => {
      return Groups.populate(userList, { path: "group" })
        .then(()=>{ res.send({ data: userList }) })
        .catch(error => { throw error });
    })
    .catch(error => res.status(404).send({ data: error }));
}

function getById (req, res) {
  console.log('invoking client[getById]');
  return Clients.findById({ _id: req.params.id })
    .then(client => {
      Groups.populate(client, { path: "group" })
        .then(()=>{
          Users.populate(client, { path: "user" })
            .then(()=>{
              Zones.populate(client, { path: "zone" })
                .then(()=>{
                  res.send({ data: client });
                })
                .catch(error => { throw error });
            })
            .catch(error => { throw error });
        })
        .catch(error => { throw error });
    })
    .catch(error => res.status(404).send({ data: error }));
}

function getByZoneId (req, res) {
  console.log('invoking client[getByZoneId]');
  return Clients.find({
    zone: req.params.id
  })
    .then(client => {
      Groups.populate(client, { path: "group" })
        .then(()=>{
          Users.populate(client, { path: "user" })
            .then(()=>{
              Zones.populate(client, { path: "zone" })
                .then(()=>{
                  res.send({ data: client });
                })
                .catch(error => { throw error });
            })
            .catch(error => { throw error });
        })
        .catch(error => { throw error });
    })
    .catch(error => res.status(404).send({ data: error }));
}

function getByUserAvailable (req, res) {
  console.log('invoking client[getByUserAvailable]');
  return Clients.find({ user: req.params.id })
    .where('available').gte(req.query.available)
    .then(client => {
      Groups.populate(client, { path: "group" })
        .then(()=>{
          Users.populate(client, { path: "user" })
            .then(()=>{
              Zones.populate(client, { path: "zone" })
                .then(()=>{
                  res.send({ data: client });
                })
                .catch(error => { throw error });
            })
            .catch(error => { throw error });
        })
        .catch(error => { throw error });
    })
    .catch(error => res.status(404).send({ data: error }));
}

function update (req, res) {
  console.log('invoking client[update]');
  let newUser = req.body;
  return Clients.findOneAndUpdate({ _id: req.params.id }, { $set: newUser
    }, { new: true })
    .then(user => {
      res.send({ data: user });
    })
    .catch(error => res.status(404).send({ data: error }));
}

function remove (req, res) {
  console.log('invoking client[remove]');
  return Clients.remove({ _id: req.params.id })
    .then(() => res.send({ data: 'Client has been deleted' }))
    .catch(error => res.status(403).send({ data: error }));
}

function post (req, res) {
  console.log('invoking client[post]');
  return Clients.create(req.body)
  .then((client) => res.send({ data: client }))
  .catch(error => res.status(500).send({ data: error }));
}

function getByGroup (req, res) {
  console.log('invoking client[getByGroup]');
  return Clients.find({ group: req.params.id })
    .then(client => {
      Groups.populate(client, { path: "group" })
        .then(()=>{
          Users.populate(client, { path: "user" })
            .then(()=>{
              Zones.populate(client, { path: "zone" })
                .then(()=>{
                  res.send({ data: client });
                })
                .catch(error => { throw error });
            })
            .catch(error => { throw error });
        })
        .catch(error => { throw error });
    })
    .catch(error => res.status(404).send({ data: error }));
}

module.exports = { post, get, getById, getByUserAvailable, getByNickname, remove, update, getByGroup, getByZoneId };
