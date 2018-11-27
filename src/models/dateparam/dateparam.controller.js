'use strict';
const DateParam = require('./dateparam.model.js');
const TimeParam = require('../timeparam/timeparam.model.js');
const Token = require('../../config/token.js');
const jwt = require('../../middleware/jwt.js');
const NOT_FOUND_ERROR = 'Error Not Found - User can not be found';
const moment = require('moment');
const moment_timezone = require('moment-timezone');

const { TIME_ZONE } = require('../../config/constant.js');

function post(req, res){
  return DateParam.create(req.body)
    .then((respose) => res.send(
      { data: 'La restriccion de Fecha se ah creado' }
    ))
    .catch(error => res.status(500).send({ data: error }));
}

function incrementDaysFrom(oldDate, numberDaysToIncrement){
  console.log(oldDate.year(), oldDate.month(), oldDate.date(), '<-----1');
  console.log(oldDate.year(), oldDate.month(), oldDate.date() + numberDaysToIncrement, '<-----');
  return  moment.tz(new Date(oldDate.year(), oldDate.month(), oldDate.date() + numberDaysToIncrement), TIME_ZONE);
}
function checkRestriccion(nextday, dateParamList){
  let existDay = dateParamList.some(item => moment(item.daterestrict).format('YYYY-MM-DD') === moment(nextday).format('YYYY-MM-DD'));
  if (existDay){
    let currentNextDay = incrementDaysFrom(nextday, 1);
    return checkRestriccion(currentNextDay, dateParamList);
  }
  return nextday;
}
function isHollyDay(dateParamList, day){
  return dateParamList.some(item => moment(item.daterestrict).format('YYYY-MM-DD') === moment(day).format('YYYY-MM-DD'));
}

function calculateNextRestriction(dateParamList){
  var currentDate = moment.tz(new Date(), TIME_ZONE);
  var currentHour = currentDate.hour();
  var currentDay = currentDate.day();
  let oldDate = moment.tz(new Date(), TIME_ZONE);
  console.log(oldDate, '<----oldDate', currentHour);
  let disabledList = [];
  if (isHollyDay(dateParamList, oldDate)){
    let nextday = incrementDaysFrom(oldDate, 1);
    let nextdayUTC = moment.tz(nextday, TIME_ZONE).format();
    disabledList.push(nextdayUTC);
  }
  return TimeParam.find()
    .then(timeParamList =>{
      let  limitHour = timeParamList[0].timerestrict;
      if (currentHour >= limitHour){
        // console.log(currentHour, '<---LIMIT');
        if (currentDay === 6){
          // console.log(limitHour, '<---D');
          let nextday = incrementDaysFrom(oldDate, 2);
          let toRestrict = checkRestriccion(nextday, dateParamList);
          disabledList.push(toRestrict);
        } else if (currentDay < 6){
          // console.log(limitHour, '<---L - S');
          let nextday = incrementDaysFrom(oldDate, 1);
          let toRestrict = checkRestriccion(nextday, dateParamList);
          disabledList.push(toRestrict);
        }
      }
      // console.log(disabledList, '<---RESULT');
      return disabledList;
    });
}

function getNextRestrict(req, res){
  /*var currentDate = moment.tz(new Date(), TIME_ZONE);
  var currentHour = currentDate.hour();
  console.log('currentHour--->', currentHour);*/
  return DateParam.find()
      .then(dateParamList =>{
        let nextRestriction = calculateNextRestriction(dateParamList);
        nextRestriction
          .then(result => {
            if (result.length > 0){
              result.forEach(item => {
                console.log(item, '>--=-=');
                dateParamList.push({
                  _id: 0,
                  daterestrict: item,
                  reason: 'Moment',
                  __v: 0
                });
              });
            }
            res.send({ data: dateParamList });
          })
          .catch(error =>{
            throw error;
          });
      })
      .catch(error => { res.status(404).send({ data: error }); });
}

function get(req, res){
  return DateParam.find()
      .then(dateParamList =>{
      	res.send({ data: dateParamList });
      })
      .catch(error => { res.status(404).send({ data: error }); });
}

function getById(req, res){
	return DateParam.findById({ _id: req.params.id })
			.then(dateParamList =>{
			    res.status(200).send({ data: dateParamList });
      })
      .catch(error => { res.status(404).send({ data: error }); });
}

function remove(req, res){
	  return DateParam.remove({ _id: req.params.id })
        .then(() => res.send({ data: 'la Fecha se ah eliminado, de las restricciones' }))
        .catch(error => res.status(403).send({ data: error }));
}

function update(req, res){
	var dateParam = req.body;
	return DateParam.findOneAndUpdate({ _id: req.params.id }, { $set: { dateParam } }, { new: true })
			.then(item => {
			  res.send({ data: item });
      })
      .catch(error => res.status(404).send({ data: error }));
}

module.exports = { post, getNextRestrict, get, getById, remove, update};
