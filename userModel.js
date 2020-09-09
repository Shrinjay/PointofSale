//Requirements
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
require('dotenv').config()
const Schema = mongoose.Schema;

//Define Schema
const userSchema = new Schema ({
    orgName: String,
    password: String
})

//Define auth token method to generate a new auth token with the org name
userSchema.methods.generateAuthToken = function(orgName) {
    org = {id: orgName}
    const token = jwt.sign(org, process.env.PRIVATE_KEY)
    return token
}

//Instantiate User Model
const User = mongoose.model('user', userSchema);

//Export
module.exports = User;