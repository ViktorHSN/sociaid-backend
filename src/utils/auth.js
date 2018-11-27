'use strict';

var jwt = require('jsonwebtoken'),
    privateKey = process.env.secret || 'BbZJjyoXAdr8BUZuiKKARWimKfrSmQ6fv8kZ7OFfc';
    //redis = require('redis'),         
    //client = redis.createClient(process.env.REDIS_PORT,process.env.REDIS_HOST, {no_ready_check: true});

module.exports.jwtOptions = {
    key: privateKey,          // Never Share your secret key 
    validateFunc: validate,            // validate function defined above 
    verifyOptions: { algorithms: [ 'HS256' ] }
}

module.exports = {
    createToken : createToken,
    clearToken : clearToken,
    jwtOptions : {
        key: privateKey,          
        validateFunc: validate,        
        verifyOptions: { algorithms: [ 'HS256' ] }
    }
}

function createToken(userData){
    let userTokenData = {
        id : userData.id,
        username : userData.username,
        accessToken : userData.accessToken
    };

    var redisToken = jwt.sign(userTokenData,privateKey);
       // repliedToken;
        
  //  userData.token = redisToken;
  //  repliedToken = jwt.sign(userData,privateKey);
    //client.HMSET(redisToken,userData);
    return redisToken;
            
}

function clearToken(token,callback){
    jwt.verify(token,privateKey,function(err,decoded) {
    
      if(!err) {
        //client.del(decoded.token);
        callback(null);
        
      }else{
        callback(err);
      }
      
      

    });
}

function validate(decodedToken,request,callback){
    return callback(null,true,decodedToken);
}