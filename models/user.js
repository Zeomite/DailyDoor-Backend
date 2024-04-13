const mongoose = require("mongoose");
const userSchema = mongoose.Schema({
    firstName: {
        type : String,
        
    },
    lastName: {
        type : String,
        
    },
    username: {
        type : String,
        
    },
    password: {
        type : String
    },
    email: {
        type : String,
        required : true
    },
    token:{
        type : String,
        required : true
    },
    img:{
        type : String
    },
    empType:{
        type : String

    },
    idproof:{
        type : String
    },
    phNo:{
        type : String
    },
    scouted:{
        type: Array,
        default:[],
    },
    status:{
        type: Boolean,
        default: true
    }


}, {timestamps : true});
module.exports = mongoose.model("User", userSchema);