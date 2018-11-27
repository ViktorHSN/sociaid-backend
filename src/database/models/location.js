'use strict';

var Sequelize = require('sequelize'),
    database = require('..').sql;
    
var Location = database.define('location',{
    street_number: {type: Sequelize.STRING, allowNull: false},
    country: {type: Sequelize.STRING, allowNull: false},
    postal_code: {type: Sequelize.STRING},
    route:{type: Sequelize.STRING, allowNull: false},
    UF:{type: Sequelize.STRING, allowNull: false},
    sublocality:{type: Sequelize.STRING, allowNull: false},
    locality:{type: Sequelize.STRING, allowNull: false},
    complement:{type: Sequelize.STRING}
},{
    classMethods: {
        associate: function(models){
        }
    }
});

module.exports = Location;