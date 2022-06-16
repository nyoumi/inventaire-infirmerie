const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const storeSchema = mongoose.Schema({
  name: {type: String , require:true,unique:true},
  contact: {type: String , require:false},
  town: {type: String , require:true},
  localisation: {type: String , require:true } 

});

storeSchema.plugin(uniqueValidator);

module.exports = mongoose.model('Store',storeSchema);
