const mongoose = require('mongoose')
// -----------------------------------------signup-----------------------------------
const userSchema = mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    Email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    cpassword:{
        type:String,
        required:true
    }
})
const userdata = new mongoose.model('userdata',userSchema)
module.exports = userdata

// -----------------------------------------signup End-----------------------------------

