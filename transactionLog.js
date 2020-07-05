const express = require ('express')
const router = express.Router()
const tLog = require('./transactionLogModel')


router.route('/').get((req, res)=>{
    tLog.find()
    .then((found) => res.json(found))
})

router.route('/update').post((req, res)=>{
    const items = req.body.items
    const totalPrice = req.body.totalPrice
    const key = req.body.key
    const date = req.body.date

    var newLog = new tLog({
        date: date,
        items: items, 
        key: key, 
        total: totalPrice
    })

    newLog.save()
    .then(res.json(newLog))
})

module.exports= router;