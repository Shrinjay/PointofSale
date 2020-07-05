const express = require('express'); //Requires express
const router = express.Router(); //Requires the router function of express, which routes requests 
const app = express(); //Creates app as an instance of express
let Item = require('./itemModel');  //Imports the Item Model from itemModel.js
const cors = require('cors')
router.options('/items/sell', cors())
app.use(cors())

router.use(cors(
))
router.route('/', cors()).get((req, res)=>{ //Handles any GET requests to the / route
    Item.find() //Uses the find command, finding anything that's in the database with no filter. Note, no err or data query here, FIND OUT WHY
    .then(items => res.json(items)) //then defines what find() returns as items as sends items as a json object
 
})

router.route('/add', cors()).post((req, res)=>{ //Handles POST requests to the /add route 
    const name = req.body.name; //Defines the variable name as the name in the request body json
  //ipc=internal price code, a bastardized upc for small scale applications.  
    const inventory = req.body.inventory; //Defines inventory as inventory in request
    const price = req.body.price;  //Defines price as price in request

    var newItem = new Item ({ //Creates a new document called newItem 
        name: name, //Defines name, inventory and price using the info in the request body
        inventory: inventory, 
        price: price,
    });

    newItem.save() //Saves the newItem. NOTE that newItem can be anything, it can be overridden with another post request but the info in the databse will be the same. 
    .then(()=> res.json(newItem.name)); 

})

router.route('/sell', cors()).put((req, res)=>{
    var item=req.body.item;
    var amountSold=req.body.amountSold;
    var newInventory;
    var oldInventory;
    console.log(item)
    Item.findOne({name: item}, (err, found)=>{
      oldInventory=found.inventory; 
      if(typeof found =='undefined')
      {
          console.log('fuck')
      }
      newInventory = oldInventory-amountSold;
      Item.findOneAndUpdate({name: item}, {inventory: newInventory}, {new: true}, function(err, data) {
          if (typeof data=='undefined')
          {   console.log('fuck2')
              res.send('undef');
          }
          else {
          data.save();
          res.send('Success') 
          }
      });
      return null;
    })

  
    
})

router.route('/update', cors()).put((req, res)=>{
    const name = req.body.name
    const newInventory = req.body.newInventory
    Item.findOneAndUpdate({name: name}, {inventory: newInventory}, {new:true}, (err, data)=>{
        if (typeof data=='undefined')
        {   console.log('fuck2')
            res.send('undef');
        }
        else {
        data.save();
        res.send('Success') 
        }
    })
})

router.route('/delete', cors()).delete((req, res)=>{
    const name = req.body.name
    Item.findOneAndDelete({name: name}, (err, data)=>{
        if (typeof data=='undefined')
          {   console.log('fuck2')
              res.send('undef');
          }
          else {
          data.save();
          res.send('Success') 
          }
    })
})


module.exports = router;