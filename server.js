/*Server.js exists as the centerpiece of the backend. In server.js I define the port and route all incoming
requests to different routes which each have their own handlers*/ 
var express = require('express'); //Installs express
var app = express(); //Creates app as an instance of express
const mongoose = require('mongoose'); //Installs mongoose
const cors = require('cors');  //Installs CORS
require('dotenv').config(); //Installs dotenv, which I don't even use.

if (process.env.NODE_ENV === 'production') {
    // Exprees will serve up production assets
    const path = require('path');
    app.use(express.static('client/build'));
    app.get('/*', function (req, res) {
        res.sendFile(path.join(__dirname, 'build', 'index.html'));
      });
  
  }

const port = process.env.PORT || 3000 //This runs the server on port 3000, REVIEW SYNTAX.
const uri = 'mongodb+srv://Shrinjay:sunny2002@shrinjay-rjqya.mongodb.net/<dbname>?retryWrites=true&w=majority' //URI to connect to mongoDB
var mongoDB = process.env.MONGODB_URI||uri
mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true}); //Sets up connection to mongoDB database
const connection = mongoose.connection; //Creates connection as an instance
connection.once('open', ()=>{
    console.log("MongoDB Connected");
})
app.use(express.json());
app.use(cors()); //Directs app to use cors and json
app.options('*', cors())
app.use(function (req, res, next) {
    res.set('Cache-control', 'no-cache')
    next();
  })


const itemRouter = require('./Item') //Designates ./Item as the file route where all requests to item will be served to
app.use('/api/items', itemRouter); //Routes any requests at /items endpoint to the item route

const tLogRouter = require('./transactionLog')
app.use('api/log', tLogRouter);

app.listen(port, ()=>{ //Just verification to make sure the server works 
    console.log("Server Works");
})



