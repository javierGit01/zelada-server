'use strict';
const express = require('express');
const ProdOrders = require('./prodorder.controller.js');
const jwt = require('../../middleware/jwt.js');
const router = express.Router();

router.get('/', ProdOrders.get);

router.post('/create', ProdOrders.post);

router.put('/update/:id', ProdOrders.update);

router.get('/:id', ProdOrders.getById);

router.get('/user/:id', ProdOrders.getByUserId);

router.get('/report/basic', ProdOrders.getBasicReport);

router.get('/report/basictomorrow', ProdOrders.getBasicReportTomorow);

router.get('/client/:id', ProdOrders.getByClientId);

router.put('/update/status/:id', ProdOrders.updateStatus);

router.delete('/:id', ProdOrders.remove);

module.exports = router;
