const mongoose = require('mongoose')

const StudentCourse = new mongoose.Schema({
    studentID:{
        type:String
    },
    address:{
        type:String
    },
    course:{
        type:String
    },
    
    date:{
        type:Date,
        default:Date.now
    }
})
module.exports = mongoose.model("StudentCourse",StudentCourse)