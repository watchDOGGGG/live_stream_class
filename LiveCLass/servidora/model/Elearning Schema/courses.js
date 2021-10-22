const mongose = require('mongoose')


const CourseOffered = new mongose.Schema({
    school:{
        type:String,
        required:true
    },
    department:{
        type:String,
        required:true
    },
    courseCode:{
        type:String
    }
})
module.exports = mongose.model('CourseOffered',CourseOffered)