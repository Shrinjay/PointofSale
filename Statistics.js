const express = require ('express')
const router = express.Router()
const tLog = require('./transactionLogModel')
const { response } = require('express')
const jwt = require('jsonwebtoken')
require('dotenv').config()

var todaysTotal = 0;
let todaysDate = new Date()
let day2 = new Date()
let day3 = new Date()
let day4 = new Date()
let day5 = new Date()

    
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
    let sales = []
    day2.setDate(todaysDate.getDate()-1)
    day3.setDate(todaysDate.getDate()-2)
    day4.setDate(todaysDate.getDate()-3)
    day5.setDate(todaysDate.getDate()-4)
    
    tLog.find({org: jwt.verify(req.header('Authorization').split(' ')[1], process.env.PRIVATE_KEY)})
    .then(trans => {
        sales.push({
            label: day5.toDateString(),
            y: calculateTotal(trans, day5)
        })
        sales.push({
            label: day4.toDateString(),
            y: calculateTotal(trans, day4)
        })
        sales.push({
            label: day3.toDateString(), 
            y: calculateTotal(trans, day3)
        })
        sales.push({
            label: day2.toDateString(),
            y: calculateTotal(trans, day2)
        })
        sales.push({
            label: todaysDate.toDateString(),
            y: calculateTotal(trans, todaysDate)})
    
        res.json(sales)
})
})

router.route('/change').get((req, res)=>{
    let yesterday = new Date()
    yesterday.setDate(todaysDate.getDate() - 1)
    
    let yesterdayTotal = 0;
    tLog.find({org: jwt.verify(req.header('Authorization').split(' ')[1], process.env.PRIVATE_KEY)})
    .then(trans => {
        todaysTotal = calculateTotal(trans, todaysDate)
        yesterdayTotal = calculateTotal(trans, yesterday)
        res.json(percentChange(todaysTotal, yesterdayTotal))
    })
})

router.route('/topitems').get((req, res)=>{
    
    let count = {}

    tLog.find({org: jwt.verify(req.header('Authorization').split(' ')[1], process.env.PRIVATE_KEY)})
    .then(trans=> {
        trans.forEach(arg => {
            arg.items.forEach(item => {
                if (typeof(count[item])=='undefined')
                {
                    count[item]=1
                }
                else {
                    count[item] += 1
                }
            })

            
        })
        
        res.json(count)
    })
})

module.exports = router