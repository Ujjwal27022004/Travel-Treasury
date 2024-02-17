const mongoose = require('mongoose')

const contactSchema = mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    phoneno:{
        type:Number,
        required:true
    },
    message:{
        type:String,
        required:true
    }
})
const contactdata = new mongoose.model('contactdata',contactSchema)
module.exports = contactdata