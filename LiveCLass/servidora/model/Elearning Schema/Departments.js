var mongoose = require('mongoose')

const Department = new mongoose.Schema({
    school:{
        type:String
    },
    faculty:{
        type:String
    },
    department:{
        type:String
    },
    date:{
        type:Date,
        default:Date.now
    }
})
module.exports = mongoose.model('Deptm', Department)