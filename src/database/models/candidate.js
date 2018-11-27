'use strict';

var Sequelize = require('sequelize'),
    database = require('..').sql,
    User = require('./user'),
    Task = require('./task'),
    statusEnum = require('../../utils').statusCandidaturaEnum;
    
var Candidate = database.define('candidate', {
    status: {type: Sequelize.ENUM(statusEnum.aberta,statusEnum.aceita,statusEnum.cancelada,statusEnum.recusada), defaultValue: statusEnum.aberta},
    taskId:{
        type: Sequelize.INTEGER,
        references: {
            model: Task,
            key: 'id'
        },
        primaryKey: true
    },
    userId: {
        type: Sequelize.INTEGER,
        references: {
            model: User,
            key: 'id'
        },
        primaryKey: true
    },
},{
     classMethods: {
         associate: function(models){
             Candidate.belongsTo(models.user, {foreignKey:'userId', as: 'user'});
             Candidate.belongsTo(models.task, {foreignKey:'taskId', as: 'task'});
             
         }
     }
});

module.exports = Candidate;