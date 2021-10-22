const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
    fullname:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
    },
    password:{
        type:String,
        required:true,
    },
    school:{
        college:{
            type:String,
            require:true
        },
        faculty:{
            type:String,
            require:true
        },
        department:{
            type:String,
            require:true
        },

    },
    level:{
        type:String,
    },
    accountType:{
        type:String,
        require:true
    },
    identification:{
        type:String,
        required:true
    },
    gender:{
        type:String,
    },
    verified:{
        type:Number
    },
    coursesHandled:[
            {
                type:Object
            }
            
        ],
        
    dataCreated:{
        type:Date,
        default:Date.now
    }
})
module.exports = mongoose.model('UsersSchema',UserSchema)