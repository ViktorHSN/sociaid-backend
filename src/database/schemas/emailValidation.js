"use strict";

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var EmailValidationSchema = new Schema({
    id : String,
    email : String
});


//Add everything to schema before calling model();
var EmailValidationModel = mongoose.model('UserEmail',EmailValidationSchema);

module.exports = EmailValidationModel;