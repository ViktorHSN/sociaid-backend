'use strict';

var Sequelize = require('sequelize'),
    database = require('..').sql;
    
var Comments = database.define('comment', {
    comment: { type: Sequelize.STRING, allowNull: false},
    dateTime: {type: Sequelize.DATE, defaultValue: Sequelize.NOW}
},{
    classMethods: {
        associate: function(models){
            Comments.belongsTo(models.user,{foreignKey:'userId',as: 'comentador'});
            Comments.belongsTo(models.task,{foreignKey:'taskId',as: 'comentado'});
        }
    }},
    {
        timestamps: false
    }
);

module.exports = Comments;