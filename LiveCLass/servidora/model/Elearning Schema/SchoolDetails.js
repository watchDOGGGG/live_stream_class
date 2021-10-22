var mongoose = require('mongoose')

const SchoolDetails = new mongoose.Schema({
    schoolName:{
        type:String
    },
    location:{
        type:String
    },
    vc:{
        type:String
    },
    nos:{
        type:Number
    },
    contract:{
        type:Boolean
    },
    closed:{
        type:Boolean
    },
    dateJoin:{
        type:Date,
        default:Date.now
    }
})
module.exports = mongoose.model('schoolDT',SchoolDetails)