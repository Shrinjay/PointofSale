const express = require ('express')
const router = express.Router()
const tLog = require('./transactionLogModel')
const jwt = require('jsonwebtoken');
require('dotenv').config()

router.route('/').get((req, res)=>{
    tLog.find({org: jwt.verify(req.header('Authorization').split(' ')[1], process.env.PRIVATE_KEY)})
    .then((found) => res.json(found))
})

router.route('/update').post((req, res)=>{
    const items = req.body.items
    const reqOrg =jwt.verify(req.header('Authorization').split(' ')[1], process.env.PRIVATE_KEY)
    const totalPrice = req.body.totalPrice
    const key = req.body.key
    const date = req.body.date
    
    if (items=="")
    {
        res.send("No transaction")
    }

    var newLog = new tLog({
        date: date,
        org: reqOrg,
        items: items, 
        key: key, 
        total: totalPrice
    })
    console.log(newLog)
    newLog.save()
    .then(res.json(newLog))
})

module.exports= router;