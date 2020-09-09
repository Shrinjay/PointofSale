//Requirements
const passport = require('passport');
var JWTStrategy = require('passport-jwt').Strategy,
 ExtractJWT = require('passport-jwt').ExtractJwt;
const User = require('../userModel')
require ('dotenv').config()

//Configure options, none, extract JWT method, and private key.
const opts = {};
opts.jwtFromRequest = ExtractJWT.fromAuthHeaderWithScheme('JWT');
opts.secretOrKey = process.env.PRIVATE_KEY;

//Define JWT strategy
passport.use('jwt', new JWTStrategy(opts, (jwt_payload, done)=>{
    User.findOne({orgName: jwt_payload.id})
        .then(user => {
            //If user exists and JWT is valid.
            if (user)
            {
                done(null, user)
            }

            //If user doesn't exist or invalid JWT.
            else {   
                done(null, false)
            }
        })
        .catch(err => {
            console.log(err)
            return
        })
}))
