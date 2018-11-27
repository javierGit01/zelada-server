'use strict';
const express = require('express');
const timeParams = require('./timeparam.controller.js');
const jwt = require('../../middleware/jwt.js');
const router = express.Router();

router.get('/', jwt.validateToken, timeParams.get);

router.get('/:id', jwt.validateToken, timeParams.getById);

router.post('/create', jwt.validateToken, timeParams.post);

router.put('/update/:id', jwt.validateToken, timeParams.update);

router.delete('/delete/:id', jwt.validateToken, timeParams.remove);

module.exports = router;
