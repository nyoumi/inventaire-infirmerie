const mongoose = require('mongoose');

const salesSchema = mongoose.Schema({
  //drugName: {type: Array, require:true},
  drugName:{type: String,require:false},
  drugId:{type: String,require:true},
  dateTime: {type: Date , require:true, default: Date.now },
  totalPrice: {type: String , require:false},
  tax: {type: String , require:false},
  
  paidAmount: {type: String , require:false},
  balance : { type: String , require: false},
  pharmacyId: {type: String , require:true},
  quantity: {type: Number , require:true},
  user_cuid: {type: String , require:true},
  reason: {type: String , require:true}
})

module.exports = mongoose.model('Sales',salesSchema);
