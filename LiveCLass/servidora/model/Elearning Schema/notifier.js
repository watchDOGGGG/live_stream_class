const mongoose = require('mongoose')

const Notification = new mongoose.Schema({
    address:{
        type:String
    },
    messageType:{
        type:String
    },
    message:{
        type:String
    },
    from:{
        type:String
    },
    to:{
        type:String
    },
    viewed:{
        type:Number
    },
    date:{
        type:Date,
        default:Date.now
    }
})
module.exports = mongoose.model("Notification",Notification)