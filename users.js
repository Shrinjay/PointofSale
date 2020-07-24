const jwt = require('jsonwebtoken');
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
let User = require('./userModel')

router.route('/login').post((req, res)=>{
try {
    let org = req.body.org
    let pass = req.body.pass
    User.findOne( {orgName: org}, async (error, found)=>{ /*Eventually, add a feature here where it differentaties between the user not existing and the password being wrong*/
       
        try {
            if (!found)
        {   
            res.send(null)
        }
        else { 
        bcrypt.compare(pass, found.password, (err, result) => {
            if (result==true)
            {  
                const response = {
                    JWT: `JWT ${jwt.sign(found.orgName, process.env.PRIVATE_KEY)}`,
                    orgName: found.orgName
                }
                
                res.json(response)    
            }
            else {
               
                res.send(null)
            }
        })
    }
        }

        catch(error) {
            console.log(error)
        }
        
    }
    )
}

catch (error) {
    console.log(error)
}
})

router.route('/newUser').post(async (req, res)=>{
    let org = req.body.org
    let pass = await bcrypt.hash(req.body.pass, 10)
   
        var newOrg = new User ({
            orgName: org,
            password: pass
        })
    
        newOrg.save()
        .then(()=> res.send({org: req.body.org, pass: req.body.pass}))
    
   
})

module.exports = router;
