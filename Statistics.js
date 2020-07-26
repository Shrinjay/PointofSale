const express = require ('express')
const router = express.Router()
const tLog = require('./transactionLogModel')
const { response } = require('express')
const jwt = require('jsonwebtoken')
require('dotenv').config()

var todaysTotal = 0;
let todaysDate = new Date()

    
function calculateTotal(trans, date) {
    let dateString = date.toDateString()
    let total = 0;
    trans.forEach(element => {
        let transdate=new Date(element.date)
        
        transdate = transdate.toDateString()
        if (dateString==transdate)
        {
            total = total + element.total
        }
    })
    return total
}

function percentChange(newValue, oldValue) {
    let change = Math.round(((newValue-oldValue)/oldValue) * 100)
    return change
}

router.route('/sales').get((req, res)=>{
    
    tLog.find({org: jwt.verify(req.header('Authorization').split(' ')[1], process.env.PRIVATE_KEY)})
    .then(trans => {
        todaysTotal = calculateTotal(trans, todaysDate)
        
    res.json(todaysTotal)    
})
})

router.route('/change').get((req, res)=>{
    let yesterday = new Date()
    yesterday.setDate(todaysDate.getDate() - 1)
    
    let yesterdayTotal = 0;
    tLog.find({org: jwt.verify(req.header('Authorization').split(' ')[1], process.env.PRIVATE_KEY)})
    .then(trans => {
        yesterdayTotal = calculateTotal(trans, yesterday)
        res.json(percentChange(todaysTotal, yesterdayTotal))
    })
})

module.exports = router