const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

require('dotenv').config()
const Schema = mongoose.Schema;

const userSchema = new Schema ({
    orgName: String,
    password: String
})

userSchema.methods.generateAuthToken = function(orgName) {
    org = {id: orgName}
    const token = jwt.sign(org, process.env.PRIVATE_KEY)
    return token
}



const User = mongoose.model('user', userSchema);

module.exports = User;