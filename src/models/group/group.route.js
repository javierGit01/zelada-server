'use strict';
const express = require('express');
const Groups = require('./group.controller.js');
const jwt = require('../../middleware/jwt.js');
const router = express.Router();

router.get('/', jwt.validateToken, Groups.get);

router.get('/:id', Groups.getById);

router.post('/create', Groups.post);

//// router.get('/details', Groups.getGroupsDetail);

router.put('/update/:id', Groups.update);

router.delete('/:id', Groups.remove);

// router.post('/updateStatus', Groups.updateStatus);

router.get('/items/:id', Groups.getItemsByGroupId);

router.get('/:status/:quantity', Groups.getByStatus);

module.exports = router;
