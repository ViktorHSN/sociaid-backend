'use strict';

var Controller = require('./controller');

module.exports = {
    save: {
        method: 'POST',
        path: '/api/avaliations',
        config: {
            auth : {
                strategy: 'jwt'
            },
            handler: Controller.save
        }
    }
}