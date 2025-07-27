const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
    profileImage: {
        type: String,
        default: ""
      },
      
    name:{
        type:String,
        required:true  // validate form
    },
    username:{
        type:String,
        required:true,
        unique: true
    },    
    email:{
        type:String,
        required:true  
    },
    phone:{
        type:String,
        required:true  
    },
    password:{
        type:String,
        required:true  
    },
    confirmPassword:{
        type:String,
        required:true 
    },


});

module.exports = mongoose.model(
    "UserModel",  // file name
    userSchema   //function name
)