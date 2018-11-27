var Location = require('..').models.location,
     db = require('..').database,
     Utils = require('../../utils').dataUtils;
     
module.exports = {
    findOne : findOne
}

function findOne(params){
   return Location.findOne({
        where: params,
        attributes: Utils.locationAttributes
    });
}