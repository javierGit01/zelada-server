'use strict';
const express = require('express');
const Clients = require('./client.controller.js');
const jwt = require('../../middleware/jwt.js');
const router = express.Router();

router.get('/', jwt.validateToken, Clients.get);

router.delete('/:id', jwt.validateToken, Clients.remove);

router.get('/:id', jwt.validateToken, Clients.getById);

router.get('/user/:id', jwt.validateToken, Clients.getByUserAvailable);

router.get('/nickname/:nickname', jwt.validateToken, Clients.getByNickname);

router.get('/group/:id', jwt.validateToken, Clients.getByGroup);

router.get('/zone/:id', jwt.validateToken, Clients.getByZoneId);

router.post('/create', jwt.validateToken, Clients.post);

router.put('/update/:id', jwt.validateToken, Clients.update);

module.exports = router;
