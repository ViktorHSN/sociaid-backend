'use strict';

var UserRepository = require('../../database').repository.userRepository;
var FacebookService = require('../../services').FacebookService;
var AuthUtils = require('../../utils').auth;
var Messages = require('../../utils').constants;

module.exports = {
    login : Login,
    logout : Logout
}

/**
 * Login function handler.
 * 
 * @route
 *      POST /api/login
 * @params
 *      payload:
 *          -accessToken
 * @returns
 *      jwtToken - if user is authenticated successfuly
 *      data to complete - if user needs validation.
 */
function Login(request,reply){
    let accessToken = request.payload.accessToken;
    
    console.log('authenticate access token '+accessToken);
    
    FacebookService.getFbUser(accessToken,function(res){
        
        console.log(res);
        
        //TODO rever tabela facebook id. Nova tabela de autenticacao
        let searchFilter = {
            email: res.email,
            facebookId: res.id
            
        }

        UserRepository.findById(searchFilter, function(err,user){
            
            if(err){
                console.log(err);
                return reply({msg: 'error'}).code(500);
            }
            
            if(!user || !user.getDataValue('isEmailVerified')){
                
                updateUserFacebookId(user,searchFilter);
                
                return sendDataToComplete(res);
            }
            
            user.setDataValue('accessToken',accessToken);
            sendLoginConfirmation(user);            
        });
    });
    
    //TODO remover no futuro.
    function updateUserFacebookId(user,data){
        if(!user.getFacebookId()){
                
             UserRepository.update(user,{facebookId : data.facebookId})
                .then(function(user){
                    console.log('User : '+ user.getDataValue('facebookId')+' facebookId updated');
                })
                .catch(function(error){
                    console.log(error);
                });
        }
    }
    
    
    function sendLoginConfirmation(user){
        var token = AuthUtils.createToken(user.dataValues);
        console.log(user.getDataValue('username') +' logged in, using token '+token);
        return reply({token: token, id: user.id});
    }
    
    function sendDataToComplete(data){
        data.photo = "graph.facebook.com/"+data.id+"/picture";
        data.categories = require('../../utils').categoryEnum.categories;
        return reply(data);
    }
}

/**
 * Ends the user session, the token is removed from Redis.
 * 
 * @route
 *      /api/logout
 * 
 * @params
 *      token - jwtToken
 * 
 * @returns
 *      logout status.
 * 
 */
function Logout(request,reply){
    AuthUtils.clearToken(request.auth.token,function(err){
        
        if(err){
            console.log(err);
            reply({status : 'error'});
            return;
        }
        
        reply({status : 'success'})
        
    });
}