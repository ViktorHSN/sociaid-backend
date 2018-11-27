"use strict";

var bcrypt = require('bcrypt');

exports.cryptPassword = function(password) {

   return new Promise((resolve,reject) => {
        bcrypt.genSalt(10, function(err, salt) {
            if (err) {
                return reject(err);
            }

            bcrypt.hash(password, salt, function(err, hash) {
                if (err) {
                    return reject(err);
                }
                return resolve(hash);
            });
        });
   });
};

exports.comparePassword = function(password, userPassword) {

    return new Promise((resolve,reject) => {
        bcrypt.compare(password, userPassword, function(err, isPasswordMatch) {
            if (err) {
                return reject(err);
            }

            return resolve(isPasswordMatch);
        });
    });
};