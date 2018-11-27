'use strict';

const Hapi = require('hapi');

const server = module.exports = new Hapi.Server({connections: {routes: {cors: true}}});

const porta = process.env.PORT || 3000;

const database = require('./database');

const authUtils = require('./utils').auth;

const sqlConnection = database.sql;

const mongoConnection = database.mongo;

require('./modules');

server.connection({port: porta});

server.register(require('hapi-auth-jwt2'),function(err){
    
    if(err){
      console.log(err);
    }
    
    server.auth.strategy('jwt','jwt',authUtils.jwtOptions);

});

server.route({
    method: 'GET',
    path: '/',
    config:{
        handler: function(request, reply){
            reply("Hello Hapi World");
        }
    }
});

mongoConnection.connection.on('error', console.error.bind(console, 'Connection Error : '));

mongoConnection.connection.once('open',function(){
    console.log('connected to mongoDB!');
});

sqlConnection.sync().then(function(){
        server.start(function(){
            console.log("server running at: ",server.info.uri);
    });
}).catch(function(error){
    console.log(error);
}); 