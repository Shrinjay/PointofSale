const passport = require('passport');
var JWTStrategy = require('passport-jwt').Strategy,
 ExtractJWT = require('passport-jwt').ExtractJwt;
const User = require('../userModel')
require ('dotenv').config()

const opts = {};
opts.jwtFromRequest = ExtractJWT.fromAuthHeaderWithScheme('JWT');
opts.secretOrKey = process.env.PRIVATE_KEY;

passport.use('jwt', new JWTStrategy(opts, (jwt_payload, done)=>{
    try {
        User.findOne({orgName: jwt_payload.id})
        .then(user => {
            if (user)
            {
                
                done(null, user)
            }
            else {
                
                done(null, false)
            }
        })
    }
    catch (err) {
        done(err)
    }
}))
