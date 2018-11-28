'use strict';
const express = require('express');
const Items = require('./item.controller.js');
// const upload = require('../publication/upload-image-config.middleware.js');
const jwt = require('../../middleware/jwt.js');
const router = express.Router();

router.get('/', jwt.validateToken, Items.get);

router.get('/images', jwt.validateToken, Items.getItemsImages);

router.put('/update/:id', jwt.validateToken, Items.update);

router.put('/updateall', jwt.validateToken, Items.updateAllFilepath);

router.get('/price', jwt.validateToken, Items.getItemPrices);

router.get('/group/:id', jwt.validateToken, Items.getByGroup);

router.get('/group/images/:id', jwt.validateToken, Items.getByGroupImages);

router.get('/:id', jwt.validateToken, Items.getById);

router.delete('/:id', jwt.validateToken, Items.remove);

router.delete('/remove/all', jwt.validateToken, Items.removeAll);

router.post('/create', jwt.validateToken, Items.post);

router.get('/groups/:id', jwt.validateToken, Items.getGroupsByItemId);

module.exports = router;
