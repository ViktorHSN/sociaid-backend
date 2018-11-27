'use strict';

var Sequelize = require('sequelize'),
    database = require('..').sql,
    categoryEnum = require('../../utils').categoryEnum;
    
//TODO ver quais informacoes de login sao necessarias ser salvas
var User = database.define('user',{
    name: {type: Sequelize.STRING, allowNull: false},
    email: {type: Sequelize.STRING, allowNull: false, unique: true},
    facebookId: {type: Sequelize.STRING, allowNull: false, unique: true},
    username: {type: Sequelize.STRING, allowNull: false, unique: true},
    password: {type: Sequelize.STRING, allowNull : true},
    skills: {type: Sequelize.STRING},
    description : {type: Sequelize.TEXT},
    positivePercent: {type: Sequelize.FLOAT, defaultValue: 0},
    neutralPercent: {type: Sequelize.FLOAT, defaultValue: 0},
    negativePercent: {type: Sequelize.FLOAT, defaultValue: 0},
    avaliationCount: {type: Sequelize.INTEGER, defaultValue: 0},
    photo: {type: Sequelize.BLOB},
    isEmailVerified : {type : Sequelize.BOOLEAN, defaultValue: false}
},{
    classMethods: {
        associate: function(models){
            User.hasMany(models.task,{foreignKey: 'ownerId'});
            User.hasMany(models.comment,{as: 'userId'});
            User.hasMany(models.avaliation,{as: 'avaliator', foreignKey: 'avaliatorId'});
            User.hasMany(models.avaliation,{as: 'avaliations', foreignKey: 'subjectId'});
            User.hasMany(models.candidate,{as: 'candidatures', foreignKey: 'userId'});
        }
    },
    instanceMethods: {
        getName: function(){
            return this.getDataValue('name');
        },
        setOwnedTasks: function(tasks){
            let ownedTasksIds = [];
            
            for(let task of tasks){
                ownedTasksIds.push(task.getDataValue('id'));
            }
            
            this.setDataValue('ownedTasks',ownedTasksIds);
        },
        getFacebookId : function(){
            return this.getDataValue('facebookId');
        },
        getEmail : function(){
            return this.getDataValue('email');
        }
    }
});

module.exports = User;