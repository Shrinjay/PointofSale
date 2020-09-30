//Requirements
const jwt = require('jsonwebtoken');
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
let User = require('./userModel')

//Handle user login
router.route('/login').post((req, res)=>{
    let org = req.body.org
    let pass = req.body.pass
    User.findOne( {orgName: org}, async (error, found)=>{ /*Eventually, add a feature here where it differentaties between the user not existing and the password being wrong*/
        //If user doesn't exist
        if (!found) res.send(null)
        
        else { 
        //Decrypt password in db and compare
        bcrypt.compare(pass, found.password, (err, result) => {
            //If passwords match
            if (result==true)
            {   //Create a new JWT and send
                const response = {
                    JWT: `JWT ${jwt.sign(found.orgName, process.env.PRIVATE_KEY)}`,
                    orgName: found.orgName
                }
                
                res.json(response)    
            }
            //If passwords don't match
            else res.send(null)
            
        })
        
    }})
    .catch(err => res.send(err))

})

//Handle new user creation
router.route('/newUser').post(async (req, res)=>{
    let org = req.body.org
    let pass = await bcrypt.hash(req.body.pass, 10) //Hash password and save rather than saving then hashing
   
        var newOrg = new User ({
            orgName: org,
            password: pass
        })
        
        newOrg.save()
        .then(()=> res.send({org: req.body.org, pass: pass})) 
})

module.exports = router;
