const mongoose = require('mongoose');

const inventorySchema = mongoose.Schema({
  user_cuid: {type: String , require:true},
  drugId: {type: String , require:true},  
  pharmacy: {type: String , require:true},
  quantity: {type: Number  , require:true},
  batchId: {type: String , require:false},
  expireDate: {type: Date , require:true},
  creationDate: {type: Date , require:true, default: Date.now },
  price: {type: Number , require:true,default: 0}
})

module.exports = mongoose.model('Inventory',inventorySchema);
