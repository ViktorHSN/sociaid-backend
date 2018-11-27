"use strict";

var emailValidation = require('..').mongoModels.emailValidation;

module.exports = {
    create : create,
    findByVerifId : findByVerifId,
    remove : remove
}
/**
 * Save a email validation on mongo.
 * 
 * @params
 * {
 *      id : value,
 *      email : value
 * }
 * 
 * @callback
 *      callback function that handles the result.
 * 
 */
function create(params,callback){
    
    let emailVal = new emailValidation(params);
    
    emailVal.save(callback);
    
}

/**
 * Procura por um email pelo id da verificacao.
 * 
 * @verifId
 *         Generated ID for the verification.
 * 
 * 
 */
function findByVerifId(verifId,callback){
    
    let query = emailValidation.findOne({id : verifId});
    
    query.select('email');
    
    query.exec(callback);
    
}

/**
 * Removes a EmailVerification based on ID.
 * 
 * @verifId
 *        Generated ID for the verification.
 * 
 */
function remove(email,callback){

    let query = emailValidation.remove({email : email});

    query.exec();
    
}