/* global EvaluatedCandidate */
'use strict';

var Sequelize = require('sequelize'),
    database = require('..').sql,
    User = require('./user'),
    Task = require('./task');

var Avaliation = database.define('avaliation',{
    comment: {type: Sequelize.TEXT, allowNull: false},
    rating: {type: Sequelize.DECIMAL(1), allowNull: false},
    avaliatorId: {
        type: Sequelize.INTEGER,
        references: {
            model: User,
            key: 'id'
        }
    },
    subjectId: {
        type: Sequelize.INTEGER,
        references: {
            model: User,
            key: 'id'
        },
        primaryKey: true
    },
    taskId:{
        type: Sequelize.INTEGER,
        references: {
            model: Task,
            key: 'id'
        },
        primaryKey: true
    }
},{
    classMethods: {
        associate: function(models){
            Avaliation.belongsTo(models.user, {foreignKey: 'avaliatorId', as: 'avaliator'});
            Avaliation.belongsTo(models.user, { foreignKey: 'subjectId', as: 'subject'});
            Avaliation.belongsTo(models.task, { foreignKey: 'taskId', as: 'task'});
        }
    }
});

module.exports = Avaliation;