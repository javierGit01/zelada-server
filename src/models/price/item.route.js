'use strict';
const express = require('express');
const Items = require('./item.controller.js');
// const upload = require('../publication/upload-image-config.middleware.js');
const jwt = require('../../middleware/jwt.js');
const router = express.Router();

router.get('/', Items.get);

router.get('/:_id', Items.getById);

router.delete('/:id', Items.remove);

router.post('/create', Items.post);

router.put('/update/:id', Items.update);

router.post('/updateStatus', Items.updateStatus);

router.post('/groups/create', Items.postItemGroup);

router.get('/groups/:id', Items.getGroupsByItemId);

module.exports = router;
