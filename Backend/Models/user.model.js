const mongoose = require('mongoose');


const UserSchema = new mongoose.Schema({
  username: { type: String, unique: true, required: true },
  pin: { type: String,unique:true, required: true} ,
  accountNumber: { type: String, unique: true },
  balance: { type: Number, default: 0 },
  lockUntil: { type: Date, default: null },
  failedAttempts: { type: Number, default: 0 },
  isLogedIn:{type:Boolean,default:false}
});



const userModel = mongoose.model('User', UserSchema);

module.exports={userModel}