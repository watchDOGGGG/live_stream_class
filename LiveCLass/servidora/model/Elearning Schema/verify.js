const mongoose = require('mongoose')

const Verify = new mongoose.Schema({
    UserID:{
        type:String
    },
    VerifyPin:{
        type:String,
        required:true
    }
})
module.exports = mongoose.model("Verification",Verify)