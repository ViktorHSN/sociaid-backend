'use strict';

var User = require('..').models.user,
    Avaliation = require('..').models.avaliation,
    Task = require('..').models.task,
    Utils = require('../../utils').dataUtils;

module.exports = {
    findAll : findAll,
    findById : findById,
    create : create,
    update : update
}

function findAll(params,callback){
    User.findAll({
        attributes: Utils.userAttributes,
        where: params
    }).then(function(users){
        callback(null,users);
    }).catch(function(err){
        callback(err,null);
    });
}
    
function findById(params,callback){
    User.findOne({
        where: {$or: params},
        attributes: Utils.userAttributes,
        include: [{
            model: Avaliation, as: 'avaliations', foreignKey: 'subjectId',attributes: Utils.avaliationAttributes,
                include: [{model: User, as: 'avaliator', foreignKey: 'subjectId',  attributes: Utils.userAttributes},
                          {model: Task, as: 'task', foreignKey: 'taskId',attributes: ['title','id','ownerId']}]
        }]
    }).then(function(user){
        callback(null,user);   
    }).catch(function(err){
        callback(err,null);
    });;
}
    
function create(params){
    return User.create(params);
}
    
function update(user,params){
    return user.update(params);
}
