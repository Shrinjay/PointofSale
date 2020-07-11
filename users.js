const express = require('express');
const router = express.Router()

let User = require('./userModel')

router.route('/login/').post((req, res)=>{
    let org = req.body.org
    let pass = req.body.pass
    User.findOne( {orgName: org}, (error, found)=>{
       
        if (!found)
        {   console.log("fuck")
            res.send(null)
        }
        else { console.log(found.password)
            console.log(pass)
        if (found.password==pass)
        {   
            res.send(found.orgName)
        }
    }
        
    }
    )
})

router.route('/newUser/').post((req, res)=>{
    let org = req.body.org
    let pass = req.body.pass

    var newOrg = new User ({
        orgName: org,
        password: pass
    })

    newOrg.save()
    .then(()=> res.send(org))
})

module.exports = router;
