const moongose = require('mongoose')

const Questions = new moongose.Schema({
    Questions:{
        type:String,
        required:true
    },
    userAsking:{
        type:String,
        required:true
    },
    classaddress:{
        type:String,
        required:true
    },
    lectureID:{
        type:String
    },
    askedDate:{
        type:Date,
        default:Date.now
    }
})
module.exports = moongose.model("ClassQuestions",Questions)