const express = require('express'); //Requires express
const router = express.Router(); //Requires the router function of express, which routes requests 
const jwt = require('jsonwebtoken');
require('dotenv').config()

let Item = require('./itemModel');  //Imports the Item Model from itemModel.js
const { ExtractJwt } = require('passport-jwt');


router.route('/').get((req, res)=>{ //Handles any GET requests to the / route
    Item.find({org: jwt.verify(req.header('Authorization').split(' ')[1], process.env.PRIVATE_KEY)}) //Uses the find command, finding anything that's in the database with no filter. Note, no err or data query here, FIND OUT WHY
    .then(items => 
        res.json(items)) //then defines what find() returns as items as sends items as a json object
 
})

router.route('/add').post((req, res)=>{ 
    //Handles POST requests to the /add route 
    const name = req.body.name; //Defines the variable name as the name in the request body json
    const org = jwt.verify(req.header('Authorization').split(' ')[1], process.env.PRIVATE_KEY);      
    const inventory = req.body.inventory; //Defines inventory as inventory in request
    const price = req.body.price;  //Defines price as price in request

    var newItem = new Item ({ //Creates a new document called newItem 
        name: name, //Defines name, inventory and price using the info in the request body
        org: org,
        inventory: inventory, 
        price: price,
    });

    newItem.save() //Saves the newItem. NOTE that newItem can be anything, it can be overridden with another post request but the info in the databse will be the same. 
    .then(()=> res.json(newItem.name)); 

})

router.route('/sell').put((req, res)=>{
    var item=req.body.item;
    var amountSold=req.body.amountSold;
    var reqOrg = jwt.verify(req.header('Authorization').split(' ')[1], process.env.PRIVATE_KEY);
    var newInventory;
    var oldInventory;
    Item.findOne({name: item, org: reqOrg}, (err, found)=>{
      oldInventory=found.inventory; 
      
      newInventory = oldInventory-amountSold;
      if (newInventory<0)
      {
          res.send('Excess sold')
          return
      }
      Item.findOneAndUpdate({name: item, org: reqOrg}, {inventory: newInventory}, {new: true}, function(err, data) {
          if (typeof data=='undefined')
          {   
              res.send('undef');
          }
          
          else {
          data.save();
           res.json(data)
          }
      });
      return null;
    })

  
    
})

router.route('/update').put((req, res)=>{
    const name = req.body.name
    const reqOrg = jwt.verify(req.header('Authorization').split(' ')[1], process.env.PRIVATE_KEY)
    const newInventory = req.body.newInventory
    Item.findOneAndUpdate({name: name, org: reqOrg}, {inventory: newInventory}, {new:true}, (err, data)=>{
        if (typeof data=='undefined')
        { 
            res.send('undef');
        }
        else {
        data.save();
        res.send('Success') 
        }
    })
})

router.route('/delete').delete((req, res)=>{
    const name = req.body.name
    const reqOrg = jwt.verify(req.header('Authorization').split(' ')[1], process.env.PRIVATE_KEY)
    Item.findOneAndDelete({name: name, org: reqOrg}, (err, data)=>{
        if (typeof data=='undefined')
          {  
              res.send('undef');
          }
          else {
          data.save();
          res.send('Success') 
          }
    })
})


module.exports = router;