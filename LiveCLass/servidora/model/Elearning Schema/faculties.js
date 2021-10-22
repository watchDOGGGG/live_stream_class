var mongoose = require('mongoose')

const Faculty = new mongoose.Schema({
    school:{
        type:String
    },
    faculty:{
        type:String
    },
    date:{
        type:Date,
        default:Date.now
    }
})
module.exports = mongoose.model('Faculty', Faculty)