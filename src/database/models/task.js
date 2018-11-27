'use strict';

const Sequelize = require('sequelize'),
    database = require('..').sql,
    statusEnum = require('../../utils').statusTarefaEnum,
    categoryEnum = require('../../utils').categoryEnum;
    
   
var Task = database.define('task',{
    title: {type: Sequelize.STRING, allowNull: false},
    category: {type: Sequelize.ENUM(categoryEnum.categories), allowNull: false},
    description: {type: Sequelize.TEXT, allowNull: false},
    price: {type: Sequelize.DECIMAL(10,2), defaultValue: 0},
    status: {type: Sequelize.ENUM(statusEnum.aberta,statusEnum.aguardando , statusEnum.cancelada, statusEnum.concluida)  , allowNull: false, defaultValue: statusEnum.aberta},
    photo: {type: Sequelize.BLOB},
    negotiable: { type: Sequelize.BOOLEAN, allowNull: false},
    lat: {type: Sequelize.FLOAT(10,6), allowNull : false},
    lng: {type: Sequelize.FLOAT(10,6), allowNull : false}
}, {
    classMethods: {
        associate: function(models){
            Task.hasMany(models.comment,{foreignKey: 'taskId'});
            Task.hasMany(models.candidate,{foreignKey: 'taskId', as: 'candidates'});
            Task.belongsTo(models.user,{ foreignKey: 'ownerId', as: 'owner'});
            Task.hasOne(models.location, {foreignKey: 'taskId'})
        }
    }
});

module.exports = Task;