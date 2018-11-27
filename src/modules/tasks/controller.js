'use strict';

var  Utils = require('../../utils').dataUtils,
     Categories = require('../../utils').categoryEnum,
     StatusEnum = require('../../utils').statusTarefaEnum,
     CandidaturaEnum = require('../../utils').statusCandidaturaEnum,
     Messages = require('../../utils').constants,
     TaskRepository = require('../../database').repository.taskRepository,
     UserRepository = require('../../database').repository.userRepository,
     LocationRepository = require('../../database').repository.locationRepository;
     

module.exports = {
    get: Get,
    one: One,
    save: Save,
    edit: Edit,
    saveCandidate: SaveCandidate,
    saveComment: SaveComment,
    getLocation: GetLocation,
    getCategories: GetCategories,
    editCandidate : EditCandidate
}

function Get(request,reply){

    var options = {
        offset : request.query.offset
    }
    
    delete request.query.offset;
    
    let getTasks = function(err,tasks){
        if(err){
            console.log(err);
            reply({msg: 'error'}).code(500);
            return;
        }
        
        reply(Utils.checkDataNull(tasks));
    }
    
    TaskRepository.findAll(request.query,options,getTasks);

}

function GetLocation(request,reply){
    
    var options = {
        lat : request.query.lat,
        lng : request.query.lng,
        distanceType : request.query.distanceType == 'km' ? 6371 : 3959, 
        offset : request.query.offset
    }
    
    options.maxDistance = request.query.dist;
    options.limit = 50;
    
    delete request.query.lat;
    delete request.query.lng;
    delete request.query.distanceType;
    delete request.query.offset;
    delete request.query.dist;
    
    TaskRepository.findAllByLocation(request.query,options,function(err,tasks){
        if(err){
            console.log(err);
            reply({msg: 'error'}).code(500);
            return;
        }
        console.log("filtrando tasks");
        let filteredTasks = tasks.filter(filterDistance(options.maxDistance));
        reply(Utils.checkDataNull( filteredTasks));
        
    });
    
}

function filterDistance(distance){
    return function(task){
        return task.getDataValue('distance') < distance;
    } 
}

function One(request,reply){
   
    TaskRepository.findById(request.params,function(err,task){
        
        if(err){
            console.log(err);
            return reply({msg: 'error'}).code(500);
            
        }
        
        if(task == null){
           return reply({msg: Messages.dataNotFound});
            
        }
      
        if(request.auth.credentials.id == task.getDataValue('ownerId')){
                TaskRepository.getCandidates(task).then(function(candidates){
                    task.setDataValue('candidates',candidates);
                    
                    LocationRepository.findOne({'taskId' : task.getDataValue('id')}).
                        then(function(taskLocation){
                            task.setDataValue('location',taskLocation);
                            reply(Utils.checkDataNull(task));
                        }).catch(function(err){
                            console.log(err);
                            return reply({msg: 'error'}).code(500);
                        });
                    
                    
            }).catch(function(err){
                console.log(err);
                return reply({msg: 'error'}).code(500);
            })
        }else{
            reply(Utils.checkDataNull(task)); 
        }
    });
}

/**
 * TODO escrever espec
 */

function Save(request,reply){
    console.log("salvar tarefa");
    
    request.payload.task.ownerId = request.auth.credentials.id;
    TaskRepository.create(request.payload,function(err,createdTask){
        
        if(err){
            console.log(err);
            reply({msg: 'error'}).code(500);
            return;
        }
        
        reply(createdTask);
        return;
    });
}

function Edit(request,reply){
    TaskRepository.findById(request.params,function(err,task){
        
        if(err){
            console.log(err);
            reply({msg: 'error'}).code(500);
            return;
        }
        
        if(task.ownerId != request.auth.credentials.id){
            reply({msg: Messages.editTaskException});
            return;
        }
        
        if(task.status != StatusEnum.aberta){
            reply({msg: Messages.updateTaskErrorMessage});
            return;
        }
        
        TaskRepository.update(task,request.payload,function(err,task){
            reply(task);
        });
        
    });
}


function SaveCandidate(request,reply){
    
    
    let params = {
        userId : request.auth.credentials.id,
        taskId : request.params.id
    }
    
    console.log(request.auth.credentials.username + ' está tentando se candidatar a task com id '+params.taskId);
    
    TaskRepository.findById({id : params.taskId},function(err,task){
        if(task == null){
            reply({msg: Messages.dataNotFound});
            return;
        }
        
        if(task.owner.getDataValue('id') == params.userId){
            reply({msg: Messages.candidateToTaskException});
            return;
        }
        
        TaskRepository.createCandidate(params,function(err,candidate){
        
            if(err){
                console.log(err);
                reply({msg: 'error'}).code(500);
                return;
            }
            
            reply(candidate);
        });
    });
}

function EditCandidate(request,reply){
    
    let searchFields = {
        taskId : request.params.id,
        userId : request.params.cId
    }
    
    TaskRepository.getCandidate(searchFields).then(function(candidate){
        if(candidate){
            //TODO rever em que status as candidaturas podem ser alteradas.
            // if(candidate.getDataValue('status') != CandidaturaEnum.aberta){
            //     reply({msg: Messages.editCandidateException});
            //     return;
            // }
            
            return TaskRepository.findById({id: request.params.id},function(err,task){
                
                if(err){
                    console.log(err);
                    reply({msg: 'error'}).code(500);
                    return;
                }
                
                if(task.owner.getDataValue('id') != request.auth.credentials.id){
                    reply({msg : Messages.editCandidadeOwnerException});
                    return;
                }
                
                TaskRepository.editCandidate(candidate,request.payload).then(function(candidate){
                    reply(candidate);
                    return;
                });
                
            });
            
            
        }else{
            reply({msg: Messages.dataNotFound});
        }
        
    }).catch(function(err){
       console.log(err);
       reply({msg: 'error'}).code(500); 
    });
    
}

function SaveComment(request,reply){

    var data =  {
        comment: request.payload.comment,
        taskId: request.params.id,
        userId: request.auth.credentials.id
    };
    
    TaskRepository.saveComment(data,function(err,task){
        
        if(err){
            console.log(err);
            reply({msg: 'error'}).code(500);
            return;
        }
        
        reply(Utils.checkDataNull(task));
    });
}

function GetCategories(request,reply){
    let retorno = {};
    
    for(let name of Categories.categories){
        retorno[name] = [];
        retorno[name].push(name); 
    }
    
    reply(retorno);
}