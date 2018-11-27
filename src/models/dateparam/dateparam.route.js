'use strict';
const express = require('express');
const dateParams = require('./dateparam.controller.js');
const jwt = require('../../middleware/jwt.js');
const router = express.Router();

router.get('/', jwt.validateToken, dateParams.get);

router.get('/next', jwt.validateToken, dateParams.getNextRestrict);

router.get('/:id', jwt.validateToken, dateParams.getById);

router.post('/create', jwt.validateToken, dateParams.post);

router.put('/update/:id', jwt.validateToken, dateParams.update);

router.delete('/delete/:id', jwt.validateToken, dateParams.remove);

module.exports = router;
