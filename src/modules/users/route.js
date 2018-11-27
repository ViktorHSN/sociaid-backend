'use strict';

var Controller = require('./controller');

module.exports = {
    one: {
        method: 'GET',
        path: '/api/users/{id}',
        config: {
            auth : {
                strategy: 'jwt'
            },
            handler: Controller.one
        }
    },
    getApplications: {
        method: 'GET',
        path: '/api/users/applications',
        config: {
            auth : {
                strategy: 'jwt'
            },
            handler: Controller.getApplications
        }
    },
    save: {
        method: 'POST',
        path: '/api/users',
        config: {
            handler: Controller.save
        }
    },
    checkUsername: {
        method: 'GET',
        path: '/api/{username}',
        config: {
            handler: Controller.checkUsername
        }
    },
    verifyEmail: {
        method: 'POST',
        path: '/api/users/verify',
        config: {
            handler: Controller.verifyEmail
        }
    }
    
    // getTasks: {
    //     method: 'GET',
    //     path: '/api/users/tasks',
    //     config: {
    //         auth : {
    //             strategy: 'jwt'
    //         },
    //         handler: Controller.getUserTasks
    //     }
    // }
    // save: {
    //     method: 'POST',
    //     path: '/api/users',
    //     config: {
    //         handler: Controller.save
    //     }
    // },
    // edit:{
    //     method: 'PUT',
    //     path: '/api/users/{id}',
    //     config: {
            
    //     }
    // },
    
    // //Avaliacoes Controlador Proprio??
    // getAvaliation: {
    //     method: 'GET',
    //     path: '/api/users/{id}/avaliations',
    //     config: {
            
    //     }
    // },
    // oneAvaliation: {
    //     method: 'GET',
    //     path: '/api/users/{id}/avaliations/{id}',
    //     config: {
            
    //     }
    // }
    // editAvaliation: {
    //     method: 'PUT',
    //     path: '/users/{id}/avaliations',
    //     config: {
            
    //     }
    // },
    // deleteAvaliation: {
    //     method: 'DELETE',
    //     path: '/users/{id}/avaliations/{commentId}',
    //     config: {
            
    //     }  
    // }
    
}