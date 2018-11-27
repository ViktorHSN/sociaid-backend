'use strict';

var Controller = require('./controller');

module.exports = {
    get: {
        method: 'GET',
        path: '/api/tasks',
        config: {
            auth : {
                strategy: 'jwt'
            },
            handler: Controller.get
        }
    },
    getLocation: {
        method: 'GET',
        path: '/api/tasks/location',
        config: {
            auth : {
                strategy: 'jwt'
            },
            handler : Controller.getLocation
        }
    },
    one: {
        method: 'GET',
        path: '/api/tasks/{id}',
        config: {
            auth : {
                strategy: 'jwt'
            },
            handler: Controller.one
        }
    },
    save: {
        method: 'POST',
        path: '/api/tasks',
        config: {
            auth : {
                strategy: 'jwt'
            },
            handler: Controller.save
        }
    },
    edit:{
        method: 'PUT',
        path: '/api/tasks/{id}',
        config: {
            auth : {
                strategy: 'jwt'
            },
            handler: Controller.edit
        }
    },
    saveCandidate:{
        method: 'POST',
        path: '/api/tasks/{id}/candidates',
        config:{
            auth : {
                strategy: 'jwt'
            },
            handler: Controller.saveCandidate
        }
    },
    editCandidate:{
        method: 'PUT',
        path: '/api/tasks/{id}/candidates/{cId}',
        config:{
            auth : {
                strategy: 'jwt'
            },
            handler: Controller.editCandidate
        }
    },
    saveComment:{
        method: 'POST',
        path: '/api/tasks/{id}/comments',
        config:{
            auth : {
                strategy: 'jwt'
            },
            handler: Controller.saveComment
        }
    },
    getCategories:{
       method: 'GET',
        path: '/api/tasks/categories',
        config:{
            auth : {
                strategy: 'jwt'
            },
            handler: Controller.getCategories
        } 
    },
    
    // delete:{
    //     method: 'DELETE',
    //     path: '/tasks/{id}',
    //     config: {
            
    //     }
    // },
    // saveComment: {
    //     method: 'POST',
    //     path: '/tasks/{id}/comments',
    //     config: {
            
    //     }
    // },
    // editComment: {
    //     method: 'PUT',
    //     path: '/tasks/{id}/comments/{commentId}',
    //     config: {
            
    //     }
    // },
    // deleteComment: {
    //     method: 'DELETE',
    //     path: '/tasks/{id}/comments/{commentId}',
    //     config: {
            
    //     }  
    // }
}