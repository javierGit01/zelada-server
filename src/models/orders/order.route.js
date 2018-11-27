'use strict';
const express = require('express');
const Orders = require('./order.controller.js');
const jwt = require('../../middleware/jwt.js');
const router = express.Router();

router.get('/', Orders.get);

router.post('/create', Orders.post);

router.put('/update/:id', Orders.update);

router.get('/:id', Orders.getById);

router.get('/user/:id', Orders.getByUserId);

router.get('/report/basic', Orders.getBasicReport);

router.get('/report/basictomorrow', Orders.getBasicReportTomorow);

router.get('/client/:id', Orders.getByClientId);

router.put('/update/status/:id', Orders.updateStatus);

router.delete('/:id', Orders.remove);

module.exports = router;
