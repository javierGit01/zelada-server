'use strict';
const TimeParam = require('./timeparam.model.js');
const Token = require('../../config/token.js');
const jwt = require('../../middleware/jwt.js');
const NOT_FOUND_ERROR = 'Error Not Found - User can not be found';
const moment = require('moment');

function post(req, res){
	console.log('Invoking timeParam[post]');
  return TimeParam.create(req.body)
    .then((respose) => res.send(
      { data: 'La restriccion de Hora se ah creado' }
    ))
    .catch(error => res.status(500).send({ data: error }));
}

function get(req, res){
	console.log('Invoking timeParam[get]');
  return TimeParam.find()
      .then(timeParamList =>{
      	res.send({ data: timeParamList });
      })
      .catch(error => { res.status(404).send({ data: error }); });
}

function getById(req, res){
	console.log('Invoking timeParam[getById]');
	return TimeParam.findById({ _id: req.params.id })
			.then(timeParamList =>{
			    res.status(200).send({ data: timeParamList });
      })
      .catch(error => { res.status(404).send({ data: error }); });
}

function remove(req, res){
	console.log('Invoking timeParam[remove]');
	  return TimeParam.remove({ _id: req.params.id })
        .then(() => res.send({ data: 'la Hora se ah eliminado, de las restricciones' }))
        .catch(error => res.status(403).send({ data: error }));
}

function update(req, res){
	console.log('Invoking timeParam[update]');
	var timeParam = req.body;
	console.log(timeParam, '<====');
	return TimeParam.findOneAndUpdate({ _id: req.params.id }, { $set: {
      timerestrict: timeParam.timerestrict,
      reason: timeParam.reason
	} }, { new: true })
			.then(item => {
			  res.send({ data: item });
      })
      .catch(error => res.status(404).send({ data: error }));
}

module.exports = { post, get, getById, remove, update};
