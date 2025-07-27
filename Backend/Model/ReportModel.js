//add mongoose
const mongoose = require("mongoose");

//assign mongoose to schema
const Schema = mongoose.Schema;

//implementing a function to connnet data  that we are with this schema
const reportSchema = new Schema({
    ReportName:{
        type:String,//datatype
        required:true,//validate
    },
    ReportReason:{
        type:String,//datatype
        required:true,//validate
    },
    Date:{
        type:Date,//datatype
        required:true,//validate
    }
});

//export the model that we created
module.exports = mongoose.model(
    "ReportModel",//file name
    reportSchema//function name
)