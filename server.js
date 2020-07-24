/*Server.js exists as the centerpiece of the backend. In server.js I define the port and route all incoming
requests to different routes which each have their own handlers*/ 
var express = require('express'); //Installs express
var app = express(); //Creates app as an instance of express
const mongoose = require('mongoose'); //Installs mongoose
const cors = require('cors');  //Installs CORS
const bodyParser = require('body-parser')
require('dotenv').config(); 
const passport = require('passport')

const path = require('path');
    app.use(express.static('client/build'));

const port = process.env.PORT
const uri = process.env.MONGO_URI //URI to connect to mongoDB
mongoose.connect(uri, {useNewUrlParser: true, useUnifiedTopology: true}); //Sets up connection to mongoDB database
const connection = mongoose.connection; //Creates connection as an instance
connection.once('open', ()=>{
    console.log("MongoDB Connected");
})
app.use(express.json());
app.use(cors({origin: 'http://localhost:3000'})); //Directs app to use cors and json
app.use(passport.initialize())
require('./config/passport-config')

console.log(process.env.PRIVATE_KEY)
  console.log(process.env.MONGO_URI)

const itemRouter = require('./Item') //Designates ./Item as the file route where all requests to item will be served to
app.use('/api/items', passport.authenticate('jwt', {session: false}), itemRouter); //Routes any requests at /items endpoint to the item route

const tLogRouter = require('./transactionLog')
app.use('/api/log', passport.authenticate('jwt', {session: false}), tLogRouter);


const userRouter = require('./users')
app.use('/api/users/', userRouter);

app.get('*', (req, res) => res.sendFile(path.resolve('client/build', 'index.html')));
  

app.listen(port, ()=>{ //Just verification to make sure the server works 
    console.log("Server Works");
})




