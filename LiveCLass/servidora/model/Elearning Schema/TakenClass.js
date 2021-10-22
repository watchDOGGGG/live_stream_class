const moongose = require('mongoose')

const TakenClass = new moongose.Schema({
    userID:{
        type:String
    },
    address:{
        type:String
    },
    courseCode:{
        type:String
    },
    status:{
        taken:{
            type:Number
        }
    },
    dateTaken:{
        type:Date,
        default:Date.now
    }
})
module.exports = moongose.model("TakenClass",TakenClass)