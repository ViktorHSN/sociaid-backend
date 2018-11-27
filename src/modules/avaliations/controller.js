'use strict';

var AvaliationRepository = require('../../database').repository.avaliationRepository,
    TaskRepository = require('../../database').repository.taskRepository,
    UserRepository = require('../../database').repository.userRepository,
    StatusTarefaEnum = require('../../utils').statusTarefaEnum,
    Constants =  require('../../utils').constants,
    Utils =  require('../../utils').dataUtils;
    
module.exports = {
    save : Save
}

/**
 * 
 * 
 * 
 */
function Save(request,reply){
    
    TaskRepository.findById({id : request.payload.taskId},function(error,task){
        
        if(error){
            console.log(error);
            reply({msg: 'error'}).code(500);
            return;
        }
         
        
        if(task && task.status == StatusTarefaEnum.concluida){
             let avaliationAttributes = request.payload;
             avaliationAttributes.avaliatorId = request.auth.credentials.id;
             
             if(avaliationAttributes.avaliatorId == avaliationAttributes.subjectId){
                  reply({msg: Constants.avaliataSelfException});
                  return;
             }
             
             let query = {
                 taskId : task.id,
                 subjectId : avaliationAttributes.subjectId
             }
             
             AvaliationRepository.create(avaliationAttributes,function(error,avaliation){
                
                if(error){
                    console.log(error);
                    reply({msg: 'error'}).code(500);
                    return;
                }
                
                UpdateUserAvaliations(avaliation.subjectId,avaliation.rating);
                
                reply(avaliation);
            });
        } else {
            reply({msg : Constants.createAvaliationError});
        }
    });
}

function UpdateUserAvaliations(userId){
    var query = {id : userId};
    
    UserRepository.findById(query,function(error,user){
        
        
        if(error){
            console.log(error);
            return;
        }
        
        AvaliationRepository.count({subjectId : user.id, rating: 0},logError,function(neutrals){
            
            let neutralRatingCount = neutrals;
            
            AvaliationRepository.count({subjectId : user.id, rating: 1},logError,function(positives){
                
                let positiveRatingCount = positives;
                
                AvaliationRepository.count({subjectId : user.id, rating: -1},logError,function(negatives){
                    
                    let negativeRatingCount = negatives;
                    
                    let avaliationsCount =   neutralRatingCount + positiveRatingCount + negativeRatingCount;
      
                    let updateUser = {
                        avaliationCount: avaliationsCount,
                        positivePercent: (positiveRatingCount*100)/avaliationsCount,
                        neutralPercent:  (neutralRatingCount*100)/avaliationsCount,
                        negativePercent: (negativeRatingCount*100)/avaliationsCount            
                    }
                        
                    UserRepository.update(user,updateUser).then(function(user){
                        console.log("atualizado user avaliations")});
      
       
                });
            });
            
        });      
    });
}

function logError(error){
      console.log(error);
      return;
}

