'use strict';
const Users = require('./user.model.js');
const Groups = require('./../group/group.model.js');
const Clients = require('./../client/client.model.js');
const Token = require('../../config/token.js');
const jwt = require('../../middleware/jwt.js');
const NOT_FOUND_ERROR = 'Error Not Found - User can not be found';

const RULE_ADMIN = 1, RULE_DELIVERY = 2, RULE_BRANCH = 3, RULE_CLIENT = 4;
function getByUserAvailable (userid) {
  console.log('invoking client[getByUserAvailable]');
  return Clients.find({ user: userid })
    .then(user => {
      Groups.populate(user, { path: "group" })
        .then(()=>{
          return user;
        })
        .catch(error => { throw error });
    })
    .catch(error => { throw error });
}
function getCientsByDelivery(item){
  console.log(item._id, '>-----');
  return Clients.find({ user: item._id })
    .then(user => {
      Groups.populate(user, { path: "group" })
        .then((result)=>{
          let pair = item;
          pair.clients  = result;
          console.log('-------<', pair.fullname, '>-----', pair.clients);
          return pair;
        })
        .catch(error => { throw error });
    })
    .catch(error => { throw error })
}
function checkByRule(clientList) {
  let arrayPromisesDelivery = [];
  clientList.forEach(item => {
    if(item.rule === RULE_DELIVERY){
      arrayPromisesDelivery.push(Promise.resolve(getCientsByDelivery(item)));
    } else {
      arrayPromisesDelivery.push(Promise.resolve(item));
    }
  });
  return Promise.all(arrayPromisesDelivery)
    .then(values => {
      // console.log(values, '>-----');
      return values;
    })
    .catch(error => {
      throw error;
    })
}

function get (req, res) {
  console.log('invoking user[get]');
  return Users.find({
    deleted: false
  }, {
    password: 0,
    deleted: 0,
    __v: 0
  })
    .then(user => {
      Groups.populate(user, { path: "group" })
        .then((userWithGroup)=>{
          Clients.populate(userWithGroup, { path: "client" })
            .then((result)=>{
              res.send({ data: result });
              // checkByRule(result)
              //   .then((resultAll)=>{
              //     res.send({ data: resultAll });
              //   })
            })
        });
    })
    .catch(error => res.status(404).send({ data: error }));
}

function getById (req, res) {
  console.log('invoking user[getById]');
  return Users.findById({
    _id: req.params.id,
    deleted: false
  }, {
    __v: 0,
    password: 0,
    deleted: 0
  })
    .then(user => {
      Groups.populate(user, { path: "group" })
        .then((userWithGroup)=>{
          Clients.populate(userWithGroup, { path: "client" })
            .then(()=>{
              res.send({ data: userWithGroup });
            })
        });
    })
    .catch(error => res.status(404).send({ data: error }));
}

function getByStatus (req, res) {
  console.log('invoking user[getByStatus]');
  console.log(req.params.quantity, 'ESTE ES EL ID USUARIO');
  return Users.find({ bloqued: req.params.status }).limit(parseInt(req.params.quantity))
    .then(userList => {
      res.send({ data: userList });
    })
    .catch(error => res.status(404).send({ data: error }));
}

function update (req, res) {
  console.log('invoking user[update]');
  let newUser = req.body;
  
  if(newUser.password) {
    let encryptedPassword = jwt.passwordEncrypt(newUser.password);
    let password = { password: encryptedPassword };
    newUser = Object.assign(newUser, password)
  }
  
  return Users.findOneAndUpdate({ _id: req.params.id }, { $set: newUser }, { new: true })
    .then(user => {
      res.send({ data: user });
    })
    .catch(error => res.status(404).send({ data: error }));
}

function updateStatus (req, res) {
  console.log('invoking user[updateStatus]');
  let user = req.body;
  return Users.findOneAndUpdate({ _id: user._id }, { $set: {
      bloqued: user.bloqued
    }
  }, { new: true })
  .then(user => {
    res.send({ data: user });
  })
  .catch(error => res.status(404).send({ data: error }));
}

function remove (request, response) {
  console.log('invoking user[remove]');
  /*Phisical Remove*/
  // return Users.remove({ _id: req.params.id })
  //   .then(() => res.send({ data: 'User has been deleted' }))
  //   .catch(error => res.status(403).send({ data: error }));
  Users.findOne({
    _id: request.params.id,
    deleted: false
  }, function (err, userFound) {
    if (err)
      return response.status(500).send({
        message: 'There was a problem to delete the user, error server',
        error: err
      });
    if (!userFound)
      return response.status(404).send({
        message: 'There was a problem to get the user(invalid id)',
        error: ''
      });

    userFound.deleted = true;

    userFound.save(function (error, userUpdated) {
      if (error)
        return response.status(500).send({
          message: 'There was a problem to delete the user, error server',
          error: error
        });
      response.send({
        message: 'The user has been deleted',
        data: 'The user has been deleted'//userUpdated.getDtoUser()
      });
    });
  });
}

function login (req, res) {
  console.log('invoking user[login]');
  return Users.findOne({ nickname: req.body.nickname }, { __v: 0, deleted: 0, phone: 0 })
  .then(userpop => {
    Clients.populate(userpop, { path: "client" })
      .then(userclient => {
        Groups.populate(userclient, { path: "client.group" })
          .then(user=>{
            if (user.password !== jwt.passwordEncrypt(req.body.password)) {
              res.status(401).send({ data: { message: 'Error de Credenciales' }});
            } else {
              const tkn = jwt.createToken({ _id: user._id, username: user.fullname }, Token.secret);
              res.send({ data: { token: tkn , user }});
            }
          })
          .catch(error => res.status(500).send({ data: `unregistered user ${error}` }));
      })
      .catch(error => res.status(500).send({ data: `unregistered user ${error}` }));
  })
  .catch(error => res.status(500).send({ data: `unregistered user ${error}` }));
}

function post (req, res) {
  console.log('invoking user[post]');
  req.body.password = jwt.passwordEncrypt(req.body.password);
  return Users.create(req.body)
  .then(() => res.send({ data: 'User has been created' }))
  .catch(error => res.status(500).send({ data: error }));
}

function getByGroup (req, res) {
  console.log('invoking user[getByGroup]');
  return Users.find({ group: req.params.id })
    .then(user => {
      res.send({ data: user });
    })
    .catch(error => res.status(404).send({ data: error }));
}

module.exports = { post, get, getById, remove, login, update, updateStatus, getByStatus, getByGroup };
