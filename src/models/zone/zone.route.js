'use strict';
const express = require('express');
const Zones = require('./zone.controller.js');
const jwt = require('../../middleware/jwt.js');
const router = express.Router();

router.get('/', jwt.validateToken, Zones.get);

router.get('/:id', jwt.validateToken, Zones.getById);

router.post('/create', jwt.validateToken, Zones.post);

router.put('/update/:id', jwt.validateToken, Zones.update);

router.delete('/:id', jwt.validateToken, Zones.remove);

router.get('/:status/:quantity', jwt.validateToken, Zones.getByStatus);

module.exports = router;
