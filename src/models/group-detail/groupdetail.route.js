'use strict';
const express = require('express');
const GroupsDetail = require('./groupdetail.controller');
const jwt = require('../../middleware/jwt.js');
const router = express.Router();

router.get('/:id', GroupsDetail.getById);

router.get('/', GroupsDetail.get);

router.delete('/:id', GroupsDetail.remove);

router.delete('/item/:id', GroupsDetail.deleteDetaillGroupsByItemId);

router.delete('/group/:id', GroupsDetail.deleteDetaillGroupsByItemId);

router.post('/create', GroupsDetail.post);

router.put('/update/:id', GroupsDetail.update);

router.post('/groups/create', GroupsDetail.postItemGroup);

router.get('/groups/:id', GroupsDetail.getGroupsByItemId);

router.get('/items/:id', GroupsDetail.getItemsByGroupId);

module.exports = router;
