'use strict';

const tkn = require('../config/token.js');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

function createToken (params) {
  return jwt.sign(JSON.parse(JSON.stringify(params)), tkn.secret);
}

function validateToken (req, res, next) {
  const token = req.body.token || req.params.token || req.query.token || req.headers['x-access-token'];
  next();
  return;
  if (token) {

     jwt.verify(token, tkn.secret, err => { 
      if (err) {
         res.send({ data: 'Failed to authenticate token. Token expired' });
      } else {
         next();
      }
    });
  } else {
     res.status(403).send({ data: 'No token provided. Access rejected by server' });
  }
}

function passwordEncrypt (password) {
  const encrypted = crypto.createHmac('sha256', tkn.secret)
                   .update(password)
                   .digest('hex');
  return encrypted;
}

module.exports = { createToken, validateToken, passwordEncrypt };
