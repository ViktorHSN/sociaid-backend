'use strict';

module.exports = {
    checkDataNull : function(data){
        if(data){
            return data;
        }else{
            return {msg: "data not found"};
        }
    },
    userAttributes : {
        exclude: [ 'createdAt' , 'updatedAt', 'email','facebookId']
    },
    taskAttributes: {
       exclude: ['createdAt' , 'updatedAt','lat','lng']
    },
    commentAttributes: {
        exclude: ['createdAt' , 'updatedAt', 'taskId', 'userId']
    },
    avaliationAttributes: {
        exclude: ['createdAt' , 'updatedAt', 'taskId', 'subjectId','avaliatorId']
    },
    candidateAttributes: {
        exclude: ['createdAt' , 'updatedAt', 'taskId']
    },
    locationAttributes: {
        exclude: ['createdAt' , 'updatedAt', 'taskId']
    },
    isObjectEmpty : function(obj) {
        var hasOwnProperty = Object.prototype.hasOwnProperty;

        if (obj == null){
            return true; 
        } 

        if (obj.length > 0){
            return false; 
        }
            
        if (obj.length === 0){
            return true;
        }  

        for (var key in obj) {
            if (hasOwnProperty.call(obj, key)){
                return false; 
            } 
        }

        return true;
    }
}