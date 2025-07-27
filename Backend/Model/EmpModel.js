const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const addEmpSchema = new Schema({
   employeeId:{
        type:String,
        required:true  // validate form
    },
    name:{
        type:String,
        required:true  
    },
    email:{
        type:String,
        required:true  
    },
    username:{
        type:String,
        required:true,
        unique: true
    },
    phone:{
        type:String,
        required:true  
    },
    address:{
        type:String,
        required:true  
    },
    salary:{
        type:String,
        required:true  
    },
   role:{
        type:String,
        required:true 
    },
    department:{
        type:String,
        required:true 
    },
    task:{
        type:String,
        required:true 
    },
    image: {
        type: String,  
    },

    skills: [String],
    
 taskHistory: [{ taskId: String, status: String }]
},
{
  timestamps: true  // ✅ This enables createdAt and updatedAt
});


module.exports = mongoose.model(
    "EmpModel",  // file name
    addEmpSchema   //function name
)