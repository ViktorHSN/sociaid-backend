'use strict';

var Utils = require('../../utils').dataUtils,
    AuthUtils = require('../../utils').auth,
    StringUtils = require('randomstring'),
    MailService = require('../../services').MailService,
    UserRepository = require('../../database').repository.userRepository,
    EmailValidationRepository = require('../../database').repository.EmailValidationRepository,
    TaskRepository = require('../../database').repository.taskRepository;
    
module.exports = {
    get: Get,
    one: One,
    edit: Edit,
    getApplications : GetApplications,
    save : Save,
    checkUsername : CheckUsername,
    verifyEmail : VerifyEmail
}

function Get(request,reply){
    UserRepository.findAll(request.query,function(err,users){
        
        if(err){
            console.log(err);
            return reply({msg: 'error'}).code(500);
        }
        
        reply(Utils.checkDataNull(users));
    });
}

function One(request,reply){
    UserRepository.findById(request.params,function(err,user){
        
        if(err){
            console.log(err);
            reply({msg: 'error'}).code(500);
            return;
        }
        
        reply(Utils.checkDataNull(user));
    });
}

function CheckUsername(request,reply){
    UserRepository.findById(request.params,function(err,user){
         if(err){
            console.log(err);
            return reply({msg: 'error'}).code(500);
        }
        reply({ available : !user });
    });
}

function GetApplications(request,reply){
    
    let query = {
        userId: request.auth.credentials.id
    }
    
    TaskRepository.getCandidatesByUserId(query).then(function(applications){
       for(let app of applications){
           app.setDataValue('evaluated',false);
       }
       reply(applications); 
    }).catch(function(error){
        console.log(error);
        reply({msg: 'error'}).code(500);
    });
        
    
}
/**
 * Saves new users or updates users where e-mail was not verified. An email is sent to verify user's email.
 * 
 * @route
 *      POST /api/users
 * @params
 *      payload:
 *          - name
 *          - email
 *          - facebookId
 *          - accessToken
 *          - username
 *          - password
 *          - skills
 * @returns
 *      success message - if email is sent successfully
 *      error message - if error occurs.
 */
function Save(request,reply){
    
    //TODO photo
    
    let createUserParams = {
        name : request.payload.name,
        email : request.payload.email,
        facebookId : request.payload.facebookId,
        username : request.payload.username,
        //encriptar
        password : request.payload.password,
        skills : request.payload.skills,
        description : request.payload.description
    }
    
    let searchFilter = {
        email : request.payload.email,
        facebookId : request.payload.facebookId
    }
    
    UserRepository.findById(searchFilter,function(err,user){
        
        if(user){
            UserRepository.update(user,createUserParams)
                .then(function(user){
                    return generateVerification(user);
                })
                .catch(function(err){
                     console.log(err);
                     reply({msg:'error'}).code(500);
                });
        }else{
            UserRepository.create(createUserParams) 
                .then(function(user){
                    return generateVerification(user);
                })
                .catch(function(err){
                     console.log(err);
                     reply({msg:'error'}).code(500);
                });
        }
        
    });
    
    function generateVerification(user){
       
        const stringSize = 50; 
       
        var verificationID = StringUtils.generate(stringSize);
        
        let userEmail = user.getDataValue('email');
        
        EmailValidationRepository.create({id : verificationID, email : userEmail},function(err, emailVal){
            
            if(err){
                console.log(err);
                reply({msg:'error'}).code(500);
            }
            
            var host = process.env.frontClient || 'sociaid.com';
            
            MailService.sendVerificationEmail(host,verificationID,user.getDataValue('email'),function(err,response){
                
                if(err){
                    console.log(err);
                    return reply({msg: 'error'}).code(500);
                }
            
                reply({msg: 'emailSent', success: true});
                
            });
        });
    }    
}

/**
 * Verifies user`s email using code received in the params.
 * 
 * @route 
 *      POST /api/users/verify?verificationID = {value} 
 * 
 * @params
 *      accessToken - facebook access token.
 * 
 * @returns
 *      jwtToken - token de autenticação.
 * 
 */
function VerifyEmail(request,reply){
    
    let verificationId = request.query.verificationID;
    
    EmailValidationRepository.findByVerifId(verificationId,function(err,emailVal){
        
        if(!emailVal){
            return reply({msg:'User not registred'});
        }
        
        UserRepository.findById({email : emailVal.email},function(err,user){
            
            let confirmEmail = {isEmailVerified : true };

            console.log("User "+user.getDataValue('username')+" email successfully verified");

            EmailValidationRepository.remove(emailVal.email);
            
            UserRepository.update(user,confirmEmail).then(function(updatedUser){

               updatedUser.setDataValue('accessToken',request.payload.accessToken);

               console.log(updatedUser.getDataValue('username') +' logged in, using token '+request.payload.accessToken);

               return reply({token : AuthUtils.createToken(user.dataValues), id: user.id});
                
            }).catch(function(err){
                console.log(err);
                return reply({msg:'error'}).code(500);
            });
            
        });
        
    });
    
}

function getUserTasks(request,reply){
    
}

//TODO necessita session.
function Edit(request,reply){
    
}