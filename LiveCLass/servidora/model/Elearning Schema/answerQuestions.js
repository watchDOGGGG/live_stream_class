const moongose = require('mongoose')

const Answers = new moongose.Schema({
    Classaddress:{
        type:String,
        required:true
    },
    questionID:{
        type:String,
        required:true
    },
    replyTxt:{
        type:String,
        required:true
    },
    UserAnswering:{
        type:String
    },
    UserAsked:{
        type:String
    },
    DateAnswer:{
        type:Date,
        default:Date.now
    }
})
module.exports = moongose.model("AnswerQuestions",Answers)