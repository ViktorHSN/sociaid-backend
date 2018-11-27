'use strict';

var FB = require('fb');

module.exports = {
    getFbUser : getFbUser
}

function getFbUser(accessToken,callback){
    FB.setAccessToken(accessToken);
    FB.api('/me',{fields: ['id','name','email','is_verified']},callback);
}