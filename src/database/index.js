'use strict';

var Sequelize = require('sequelize'), //load sequelize object
    config = require('config'), // load configuration object
    dbConfig = config.get('dbConfig'), // get configuration located at /config
    requireDirectoy = require('require-directory'), 
    password = process.env.dbpassword || '901225';

//load mongoose    
const mongoose = require('mongoose');
const mongoConfig = config.get('mongoConfig');

//init sequelize
var db = new Sequelize(dbConfig.database,dbConfig.username,password,dbConfig.options);

module.exports.sql = db;

//exports sql models
var models = requireDirectoy(module, './models');

for(let model in models){
    models[model].associate(models);
}

module.exports.models = models;

//exports mongo models
var mongoModels = requireDirectoy(module,'./schemas');

module.exports.mongoModels = mongoModels;

//export repository
var repository = requireDirectoy(module, './repository');

module.exports.repository = repository;

//export mongo connection
var mongoConnection = mongoose.connect(mongoConfig.uri,mongoConfig.options);

module.exports.mongo = mongoConnection;