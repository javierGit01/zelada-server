'use strict';
const express = require('express');
const Users = require('./user.controller.js');
const jwt = require('../../middleware/jwt.js');
const router = express.Router();

router.get('/', jwt.validateToken, Users.get);

router.delete('/:id', jwt.validateToken, Users.remove);

router.get('/:id', jwt.validateToken, Users.getById);

router.get('/group/:id', jwt.validateToken, Users.getByGroup);

router.post('/login', Users.login);

router.post('/create', jwt.validateToken, Users.post);

router.put('/update/:id', jwt.validateToken, Users.update);

router.post('/updateStatus', jwt.validateToken, Users.updateStatus);

router.get('/:status/:quantity', jwt.validateToken, Users.getByStatus);

module.exports = router;
