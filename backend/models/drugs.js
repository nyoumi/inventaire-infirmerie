const mongoose = require('mongoose');

const drugsSchema = mongoose.Schema({
  name: {type: String , require:true},
  pharmacy: {type: String , require:true},
  quantity: {type: Number  , require:true},
  lastExpireDate: {type: Date , require:false},
  type: {type: String , require:true},
  creationDate: {type: Date , require:true, default: Date.now }
 // imagePath : { type: String , require: false}
})

module.exports = mongoose.model('Drug',drugsSchema);
