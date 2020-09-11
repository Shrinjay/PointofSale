const express = require('express'); //Requires express
const router = express.Router(); //Requires the router function of express, which routes requests 
const jwt = require('jsonwebtoken');
require('dotenv').config()

let Item = require('./itemModel');  //Imports the Item Model from itemModel.js
const { ExtractJwt } = require('passport-jwt');

//Handle requests to get inventory.
router.route('/').get((req, res)=>{ //Handles any GET requests to the / route
    Item.find({org: jwt.verify(req.header('Authorization').split(' ')[1], process.env.PRIVATE_KEY)}) //Uses the find command, finding anything that's in the database with no filter. Note, no err or data query here, FIND OUT WHY
    .then(items => 
        res.json(items)) //then defines what find() returns as items as sends items as a json object
    .catch(err => res.json(err)) //Exception handling
})

//Handles requests to add items to the database. 
router.route('/add').post((req, res)=>{ 

    //Extracts information from request body.
    const name = req.body.name; 
    const org = jwt.verify(req.header('Authorization').split(' ')[1], process.env.PRIVATE_KEY);      
    const inventory = req.body.inventory; 
    const price = req.body.price;  

    //Creates newItem
    var newItem = new Item ({ //Creates a new document called newItem 
        name: name, //Defines name, inventory and price using the info in the request body
        org: org,
        inventory: inventory, 
        price: price,
    });

    //Save new item in database and send the object.
    newItem.save()  
    .then(()=> res.json(newItem)) 
    .catch(err => res.json(err))

})

//Handle requests to sell items. 
//NOTE: Current architecture requires one request per item, causing a massive slowdown as each item requires its own request.
//Update to use only one request to sell mulitple items.
router.route('/sell').put((req, res)=>{

    //Extract data from body
    var item=req.body.item;
    var amountSold=req.body.amountSold;
    var reqOrg = jwt.verify(req.header('Authorization').split(' ')[1], process.env.PRIVATE_KEY);

    //Find item in request.
    Item.findOne({name: item, org: reqOrg})
    .then(found => {
        
        //Return error if no item exists. 
        if (found==null)
        {
            res.send("No such item")
            return
        }
        //Set new inventory
        found.inventory = found.inventory - amountSold
        //Check if new inventory exceeds amount sold.
        if (found.inventory<0)
        {
            res.send('Excess sold')
            return
        }
        //If all is well, save the new inventory and send the object as a response. 
        else {

            found.save()
            res.json(found)

        }
        
    })
    .catch(err => res.json(err))
  
    
})

//Update inventory route
router.route('/update').put((req, res)=>{
    
    //Extract from body
    const name = req.body.name
    const reqOrg = jwt.verify(req.header('Authorization').split(' ')[1], process.env.PRIVATE_KEY)
    const newInventory = req.body.newInventory

    //Update
    Item.findOneAndUpdate({name: name, org: reqOrg}, {inventory: newInventory}, {new:true})
    .then(data => {
        if (typeof data=='undefined' || data==null) res.send('undef')
        
        else res.send('Success') 
    })
    .catch(err => res.send(err))
})

//Delete items from database
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
    .catch(err => res.send(err))
})


module.exports = router;