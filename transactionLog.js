//Requirements
const express = require ('express')
const router = express.Router()
const tLog = require('./transactionLogModel')
const jwt = require('jsonwebtoken');
require('dotenv').config()

//Get all transaction logs
router.route('/').get((req, res)=>{
    tLog.find({org: jwt.verify(req.header('Authorization').split(' ')[1], process.env.PRIVATE_KEY)})
    .then((found) => res.json(found))
    .catch(err => res.send(err))
})

//Update transaction log with new entry
router.route('/update').post((req, res)=>{
    const items = req.body.items
    const reqOrg =jwt.verify(req.header('Authorization').split(' ')[1], process.env.PRIVATE_KEY)
    const totalPrice = req.body.totalPrice
    const key = req.body.key
    const date = req.body.date
    
    if (items=="")
    {
        res.send("No transaction")
        return 
    }

    var newLog = new tLog({
        date: date,
        org: reqOrg,
        items: items, 
        key: key, 
        total: totalPrice
    })
   
    newLog.save()
    .then(res.json(newLog))
    .catch(err => res.send(err))
})

module.exports= router;