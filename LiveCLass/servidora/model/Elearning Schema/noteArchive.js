const mongoose = require('mongoose')

const NoteArchive = new mongoose.Schema({
    userID:{
        type:String,
    },
    noteAddress:{
        type:String,   
    },
    date:{
        type:Date,
        default:Date.now
    }
})
module.exports = mongoose.model("NoteArchive",NoteArchive)