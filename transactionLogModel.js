//Requirements
const mongoose = require('mongoose'); 

//Define Schema
const transactionLogSchema = new mongoose.Schema({
    date: {type: String, require: true},
    org: {type: String, require: true},
    items: {type: Array, require: true},
    key: {type: Number, require: true},
    total: {type: Number, require: true}
})

//Instantiate into model
const tLog = mongoose.model('tLog', transactionLogSchema)

//Export
module.exports=tLog;