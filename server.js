var express = require('express'); //Installs express
var app = express(); //Creates app as an instance of express
const mongoose = require('mongoose'); //Installs mongoose
const cors = require('cors');  //Installs CORS
const bodyParser = require('body-parser') //Installs body-parser
require('dotenv').config(); //Configure dotenv
const passport = require('passport') //Install Passport
const path = require('path');

const port = process.env.PORT //Port set from environment variables 
const uri = process.env.MONGO_URI //URI to connect to mongoDB
mongoose.connect(uri, {useNewUrlParser: true, useUnifiedTopology: true}); //Sets up connection to mongoDB database
const connection = mongoose.connection; //Creates connection as an instance
connection.once('open', ()=>{
    console.log("MongoDB Connected");
})
.catch(er => console.log(err))

app.use(express.static('client/build')); //Serve static files from build, used to serve index.html at all routes.
app.use(express.json()); //Express.json middleware parses body into JSON 
app.use(cors({origin: 'http://localhost:3000'})); //Directs app to use cors and json
app.use(passport.initialize())
require('./config/passport-config') //Initialize and configure passport with JWT strategy. 


//Require routers and route requests to appropriate handlers. 
const itemRouter = require('./Item') //Designates ./Item as the file route where all requests to item will be served to
app.use('/api/items', passport.authenticate('jwt', {session: false}), itemRouter); //Routes any requests at /items endpoint to the item route

const tLogRouter = require('./transactionLog') 
app.use('/api/log', passport.authenticate('jwt', {session: false}), tLogRouter); 

const statsRouter = require('./Statistics') 
app.use('/api/statistics', passport.authenticate('jwt', {session: false}), statsRouter);

const userRouter = require('./users')
app.use('/api/users/', userRouter);

//Serve index.html on all endpoints.
app.get('*', (req, res) => res.sendFile(path.resolve('client/build', 'index.html')));
  

app.listen(port, ()=>{ //Run the server.
    console.log("Server Works");
})




