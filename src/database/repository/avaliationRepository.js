'use strict';

var Avaliation = require('..').models.avaliation;

module.exports = {
    create : create,
    findAll : findAll,
    count : count
}

function create(params,callback){
    Avaliation.create(params).then(function(avaliation){
        callback(null,avaliation);
    }).catch(function(err){
        callback(err,null);
    });
}

function findAll(query,callback){
    Avaliation.findAll({where : query}).then(function(avaliations){
        callback(null,avaliations);
    }).catch(function(err){
        callback(err,null);
    });
}

function count(query,onError,onSucess){
    Avaliation.count({where : query}).then(function(quantity){
        onSucess(quantity); 
    }).catch(function(err){
        onError(err);
    });
}