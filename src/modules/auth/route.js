'use strict';

var Controller = require('./controller'),
    Validator = require('./validator');

module.exports = {
    
    login: {
        method: 'POST',
        path: '/api/login',
        config:{
            handler: Controller.login
        }
    },
    
    logout:{
        method: 'POST',
        path: '/api/logout',
        config:{
             auth : {
                strategy: 'jwt'
            },
            handler: Controller.logout
        }
    }
}