'use strict';

var Task = require('..').models.task,
    User = require('..').models.user,
    Location = require('..').models.location,
    Candidate = require('..').models.candidate,
    Avaliation = require('..').models.avaliation,
    Comment = require('../../database').models.comment,
    Utils = require('../../utils').dataUtils,
    Constants = require('../../utils').constants,
    db = require('..').database;
    
module.exports = {
    findAll: findAll,
    findAllByLocation: findAllByLocation,
    findById: findById,
    create: create,
    update: update,
    
    saveComment: saveComment,
    
    createCandidate: createCandidate,
    getCandidates : getCandidates,
    getCandidate : getCandidate,
    editCandidate : editCandidate,
    getCandidatesByUserId: getCandidatesByUserId
    
}


function findAll(params,options,callback){
    let searchFields = {
        attributes : Utils.taskAttributes,
        include: [
            {model: Location, attributes: ['locality']}
        ],
        where: params,
        limit: options.limit,
        offset: options.offset*options.limit
    }
   
    if(Utils.isObjectEmpty(params)){
        delete searchFields.having;
    }
    
    Task.findAll(searchFields).then(function(tasks){
        callback(null,tasks);
    }).catch(function(err){
        callback(err,null);
    });
}

function findAllByLocation(params,options,callback){
        let distanceCalc =  '('+options.distanceType+'*acos('
                        + 'cos(radians('+options.lat+'))'
                        + '*cos(radians(lat)) '
                        + '*cos(radians(lng)-radians('+options.lng+'))' 
                        + '+sin(radians('+options.lat+'))' 
                        + '*sin(radians(lat))))';
        // params['distance'] = {$lt: options.maxDistance};
        // console.log(params);
        Task.findAll({
        attributes:[ 'id','title','status','category','description','price','status','negotiable',[distanceCalc,'distance']],
        where: params,
        limit: options.limit,
        offset: options.offset*options.limit,
        order: 'distance'
    }).then(function(tasks){
        callback(null,tasks);
    }).catch(function(err){
        callback(err,null);
    });
}
    
function findById(params,callback){
    Task.findOne({
        where: params,
        attributes: Utils.taskAttributes,
        include: [{
            model: User , as: 'owner', attributes: Utils.userAttributes
        },{
            model: Comment, 
            attributes: Utils.commentAttributes, 
                include: [
                    {model: User, as: 'comentador', attributes: Utils.userAttributes}
                ]
        }
        ]
    }).then(function(Task){
        callback(null,Task);
    }).catch(function(err){
        callback(err,null);
    });
}

    
function create(params,callback){
    Task.create(params.task).then(function(task){
        params.location.taskId = task.id;
        return Location.create(params.location).then(function(location){
             callback(null,task);
           
        }).catch(function(error){
             callback(error,null);
             //TODO remover task se deu error na location ??
           
        });
    }).catch(function(err){
         callback(err,null);
       
    });
}
    
function update(task,params,callback){
    task.update(params).then(function(task){
        callback(null,task);
    });
}
    
function createCandidate(params,callback){
    Candidate.create(params).then(function(candidate){
        callback(null,candidate);
    }).catch(function(err){
        callback(err,null);
    });
}


function getCandidates(task){
    
    return Candidate.findAll({
            attributes: Utils.candidateAttributes,
            include: [
                {model: User, as: 'user', foreignKey: 'userId', attributes: Utils.userAttributes}
            ],   
            where: {taskId : task.id} 
        });
}

function getCandidate(params){
    
    return Candidate.findOne({where : params});
    
}

function getCandidatesByUserId(params){
    return Candidate.findAll({
       attributes: Utils.candidateAttributes,
            include: [
                {
                    model: Task, as: 'task', foreignKey: 'taskId', attributes: Utils.taskAttributes,
                    include: [{model: User, as: 'owner', foreignKey: 'ownerId',attributes: Utils.userAttributes}]
                    
                }
            ],   
            where: params  
    });
}

function editCandidate(candidate,params){
    return candidate.update(params);
}
    
function saveComment(params,callback){
    Comment.create(params).then(function(){
        var query = { id: params.taskId };
        findById(query,function(err,task){
            callback(err,task);
        });
    }).catch(function(error){
        callback(error,null);
    });
}