const mongoose = require('mongoose')

const ClassSchema = new mongoose.Schema({
    startedBy:{
        type:String,
        required:true,
    },
    address:{
        type:String,
        required:true,
    },
    school:{
        college:{
            type:String,
            required:true,
          },
      department:{
        type:String,
        required:true,
      },
      course:{
        type:String,
        required:true,
      },
      level:{
        type:String,
        required:true,
      },
    },
    title:{
      type:String,
  },
  type:{
    type:String
  },
  expires:{
    type:Number,
  },
    date:{
        type:Date,
        default:Date.now
    }
    
})
module.exports = mongoose.model('ClassWall',ClassSchema)