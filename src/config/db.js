'use strict';
const DB_PORT = process.env.DB_PORT || 27017;
const DB_HOST = 'localhost';
const DB_NAME = 'ZeladaDB';
// const CONEXION_STRING = 'mongodb://JavierCorani:ucatec2012@cluster0-shard-00-00-e8ded.mongodb.net:27017,cluster0-shard-00-01-e8ded.mongodb.net:27017,cluster0-shard-00-02-e8ded.mongodb.net:27017/test?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin';
const CONEXION_STRING = 'mongodb://zeladaadmin:zeladaapp@cluster0-shard-00-00-kgnrs.mongodb.net:27017,cluster0-shard-00-01-kgnrs.mongodb.net:27017,cluster0-shard-00-02-kgnrs.mongodb.net:27017/zeladaDB?replicaSet=Cluster0-shard-0&ssl=true&authSource=admin';
// const CONEXION_STRING = 'mongodb://localhost:27017/ZeladaDB';
const DB = process.env.MONGODB || CONEXION_STRING;

module.exports = { url: DB };
