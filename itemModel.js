/* ItemModel sets up the schema and model for items and exports it*/
const mongoose = require('mongoose'); //Requires mongoose

const Schema = mongoose.Schema; //Creates variable schema as an instance of the property mongoose.schema

const itemSchema = new Schema ({ //Creates the item Schema 
    name: {type: String, required: true}, //Sets name to be of type string and required
    inventory: {type: Number, required: true}, //sets inventory to be a number and required
    price: {type: Number, required: true},
    org: {type: String, required: true}
});

const Item = mongoose.model('Item', itemSchema); //Creates a new model, Item, from the item schema

module.exports = Item; //Exports this model to other files.