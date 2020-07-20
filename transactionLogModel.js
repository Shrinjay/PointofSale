const mongoose = require('mongoose'); 

const transactionLogSchema = new mongoose.Schema({
    date: {type: String, require: true},
    org: {type: String, require: true},
    items: {type: Array, require: true},
    key: {type: Number, require: true},
    total: {type: Number, require: true}
})

const tLog = mongoose.model('tLog', transactionLogSchema)

module.exports=tLog;