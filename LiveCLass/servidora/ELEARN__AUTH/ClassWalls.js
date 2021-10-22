const router = require('express').Router()
const authorization = require('../MIDDLEWARE/authorization')
var randomId = require('random-id');
const Class = require('../model/Elearning Schema/ClassWall')
const Users = require('../model/Elearning Schema/Users')
const NoteArchive = require('../model/Elearning Schema/noteArchive')
const TakenClass = require('../model/Elearning Schema/TakenClass')
const Question = require('../model/Elearning Schema/classquestion')
const Answers = require('../model/Elearning Schema/answerQuestions')
const Notification = require('../model/Elearning Schema/notifier')
const StudentCourse = require('../model/Elearning Schema/studentCourse')
const Epool = require('../model/PalscheckDB/palsEDB')

//get user details
 async function GetAllUserdata(req,res,next){
    try {
        
        let GetUserDT
        GetUserDT = await Users.findById(req.params.id)
        if(!GetUserDT){
            res.status(404).json(`can't find user`)
        }
        res.GetUserDT = GetUserDT
        next() 
    } catch (error) {
        res.status(500).json(error.message)
    }
}
//get user details
router.get('/userDetails/:id',GetAllUserdata,async(req,res)=>{
    res.json({names:res.GetUserDT.fullname})
})
//start class
router.post('/',authorization,async(req,res)=>{
    const {depart,course,level,desc} = req.body
    console.log(req.body)
    // try {
    // const palsid = req.user
    // const {course,department,level,title,type} = req.body
    // const added = new Date()
    // var len = 20;
    // var pattern = 'aA0'
    // var id = randomId(len, pattern)

    // let GetUserDT
    // GetUserDT = await Users.findById(palsid) 
    //    const StartClass = await new Class({
    //     startedBy:GetUserDT._id ,
    //     address:id,
    //     school:{
    //         college:GetUserDT.school.college,
    //         department:department,
    //         course:course,
    //         level:level,
    //     },
    //     title:title,
    //     type:'uploadclass',
    //     expires:0,
    // })
    //          if(req.files !==null){
    //                 const file = req.files.file
    //                 if(file.length > 1){
    //                     for (newfile of file) {
    //                         const Insertmedia = await Epool.query("INSERT INTO palsemedia(filecategory,__filename,startedby,__address,filetype,dateadded) VALUES($1,$2,$3,$4,$5,$6) RETURNING *",['classwall',newfile.name,palsid,StartClass.address,newfile.mimetype,added])
    //                         if(Insertmedia){
    //                             const StartNewClass = await StartClass.save()
    //                             newfile.mv(`C:/xampp/htdocs/school/palscheck-elearning/src/uploads/${newfile.name}`,err=>{
    //                             })
    //                         }
    //                     }
    //                     }else{
    //                         const Insertmedia = await Epool.query("INSERT INTO palsemedia(filecategory,__filename,startedby,__address,filetype,dateadded) VALUES($1,$2,$3,$4,$5,$6) RETURNING *",['classwall',file.name,palsid,StartClass.address,file.mimetype,added])
    //                                 if(Insertmedia){
    //                                     const StartNewClass = await StartClass.save()
    //                                     file.mv(`C:/xampp/htdocs/school/palscheck-elearning/src/uploads/${file.name}`,err=>{
    //                                     })
    //                                 }
    //                     }
                    
    //                 }
    //         res.json({url:`${StartClass.address}`,course:`${course}`})
    // } catch (error) {
    //     res.status(500).json(error.message)
    // }
})
//check if class address is valid
router.get('/checkValidClass/:address',AllaboutClass,async(req,res)=>{
    res.json(res.GetClass)
})
//get Active class for lecturers
router.post('/lecturer/class',authorization,async(req,res)=>{
    const {dept,college,course} = req.body
    
    try {
  
        if (course.length > 0) {
            const courseOffer = [];
            course.forEach(async (element,i) => {      
                courseOffer.push(element);
            });
            const GetClass = await Class.find({"school.course":{ $in: courseOffer },'school.department':dept,'school.college':college,startedBy:req.user}).sort({ date: -1 }).sort({ date: -1 })
              if (GetClass) {
                if (GetClass.length > 0) {
                    //returns array to the client side
                   res.json({myclass:GetClass})               
                }
              }
         
     }else{
        res.json({myclass:0})
     }
    } catch (error) {
        console.log(error.message)
    }
})
//get All lecturer classes
router.get('/getAll/lectures',authorization,async(req,res)=>{
    try {
        const ActiveClass = await Class.find({"startedBy":req.user,"type":"uploadclass"}).sort({date:-1})
        ActiveClass.length >0?
        res.json(ActiveClass):
        res.json('you have no class')
    } catch (error) {
        res.status(500).json(error.message)
    }
})
// update class expires
router.patch('/:address',authorization,async(req,res)=>{
    try {
        const ActiveClass = await Class.find({address:req.params.address,expires:0,startedBy:req.user})
        if(ActiveClass.length>0){
            const Update = await Class.updateOne({address:req.params.address},{$set:{expires:1}})
             res.json('expires')
        }else{
            res.json('user not found')
        }

    } catch (error) {
        res.status(500).json(error.message)
    }
})

// inside the class walls

//get all info of class
async function AllaboutClass(req,res,next){
    try {
        
        let GetClass
        if(req.params.address !== null){
            GetClass = await Class.findOne({address:req.params.address})
        if(!GetClass){
            res.status(404).json(`can't find class`)
        }else{
            res.GetClass = GetClass
        next()
        }
         
        }
        
    } catch (error) {
        res.status(500).json(error.message)
    }
}
// get class Mediadata's && info
router.get('/media/:address',AllaboutClass,async(req,res)=>{
    const getMedia = await Epool.query('SELECT * FROM palsemedia WHERE __address =$1 ' ,[res.GetClass.address]) 
    if(getMedia.rows.length > 0){
        getLecturerDT = await Users.findById({"_id":res.GetClass.startedBy})
        res.json({
            filename:getMedia.rows[0].__filename,fileext:getMedia.rows[0].filetype,fileDT:res.GetClass,lecturerN:getLecturerDT.fullname
        })
    }else{
        console.log('nothing here')
    }
})
// get pdf note
router.get('/mediaNote/:address',AllaboutClass,async(req,res)=>{
    try {
        const getMedia = await Epool.query('SELECT * FROM palsemedia WHERE __address =$1 AND filetype=$2' ,[res.GetClass.address,'application/pdf']) 
        if(getMedia.rows.length > 0){
            getLecturerDT = await Users.findById({"_id":res.GetClass.startedBy})
            if(getLecturerDT){
                res.json({
                    notename:getMedia.rows[0].filetype
                })
            }else{
                console.log('no notw')
            }
        }
    } catch (error) {
        console.log(error.message)
    }
})
//get lecturers detail of the class
router.get('/startedby/:address',AllaboutClass,async(req,res)=>{
    const lecturersDT = res.GetClass.startedBy
    if(!lecturersDT){
        res.status(404)
    }
    const GetLecturerDT = await Users.findById(lecturersDT)
    if(!GetLecturerDT){
        res.status(404).json('No lecturer found')
    }
    res.json({course:res.GetClass.school.course,department:res.GetClass.school.department,lecturerN:GetLecturerDT.fullname})
})
//get courses of student 
router.get('/course/CourseHadle',authorization,async(req,res)=>{
    const getCourse = await Users.findById({"_id":req.user})
    if(getCourse){
      
        const responseArray = [];
 
        for (let index = 0; index < getCourse.coursesHandled.length; index++) {
           responseArray.push( getCourse.coursesHandled[index].courseCode); 
        }
        res.json(responseArray)
    }else{
        res.json('not found')
    } 
})


//get students that offer the course and send link to them
router.post('/send/Link/',authorization,async(req,res)=>{
    const {dept,college,course,level} = req.body
    try {
  
        if (course.length > 0) {
            const courseOffer = [];
            course.forEach(async (element,i) => {      
                courseOffer.push(element);
            });
            const GetClass = await Class.find({"school.course":{ $in: courseOffer },'school.department':dept,'school.college':college,'school.level':level}).sort({ date: -1 })
              if (GetClass) {
                if (GetClass.length > 0) {
                    //returns array to the client side
                   res.json({myclass:GetClass})               
                }
              }
         
     }else{
        res.json({myclass:0})
     }
    } catch (error) {
        console.log(error.message)
    }

})
//get all the classes uploaded for the student
router.get('/getAll/uploadedClass',authorization,async(req,res)=>{
    const fetchAllClass = await StudentCourse.find({"studentID":req.user}).sort({"_id":-1})
    if(fetchAllClass){
        res.json(fetchAllClass)
    }
})
// Insert taken Class
router.post('/takenclass/:address/:courseCode',authorization,async(req,res)=>{
    try {
        const address = req.params.address
        const courseCode = req.params.courseCode

        const checkIFclassIsTaken = await TakenClass.findOne({"userID":req.user,"address":address,"courseCode":courseCode,"status.taken":1})
        if(!checkIFclassIsTaken){
            const InsertTaken = await new TakenClass({
                userID:req.user,
                address:address,
                courseCode:courseCode,
                status:{
                    taken:1
                },

            })
            const newSave = await InsertTaken.save()
            res.json({done:1})
        }else{
            res.json({done:1})
        }
    } catch (error) {
        console.log(error.message)
    }
    
})

//check if the user has taken this class
router.get('/Checktakenclass/:address/:courseCode',authorization,async(req,res)=>{
    try {
        const address = req.params.address
        const courseCode = req.params.courseCode

        const checkIFclassIsTaken = await TakenClass.findOne({"userID":req.user,"address":address,"courseCode":courseCode,"status.taken":1})
        if(!checkIFclassIsTaken){
            res.json({done:0})
        }else{
            res.json({done:1})
        }
    } catch (error) {
        console.log(error.message)
    }
    
})

async function getLink(req,res,next){
    try {
        
        let GetLink
        GetLink = await Class.findOne().sort({date:-1})
        if(!GetLink){
            res.status(404).json(`can't find class`)
        }
        res.GetLink = GetLink
        next() 
    } catch (error) {
        res.status(500).json(error.message)
    }
}

//update for every active student
router.get('/activeStudent/:address',authorization,async(req,res)=>{
    const getUserDT = await Users.findById({"_id":req.user})
    res.json({fullname:getUserDT.fullname,ident:getUserDT.identification}) 
})
//save note
router.post('/savenote/:address',authorization,AllaboutClass,async(req,res)=>{
    const palsid = req.user
    const checkNOte = await NoteArchive.find({"noteAddress":req.params.address,"userID":req.user})
    if(checkNOte.length < 1){
        const SaveNote = await new NoteArchive({
            userID:palsid,
            noteAddress:req.params.address
        })
        const Save = await SaveNote.save()
        res.json('Save')
    }else{
        res.json('Already saved')
    }
    
    
})
// get save note
router.get('/savenote/notes',authorization,async(req,res)=>{
    const palsid = req.user
    const checkNOte = await NoteArchive.find({"userID":req.user})
    if(checkNOte.length > 0){
        const responseArray = [];
 
        for (let index = 0; index < checkNOte.length; index++) {
           responseArray.push( checkNOte[index].noteAddress ); 
        }
        res.json(responseArray)
    } 
})

router.get('/notesDetails/:address',AllaboutClass,async(req,res)=>{
   res.json(res.GetClass)
})

//Questions //
// Assking Question
router.post('/ask/question',authorization,async(req,res)=>{
    const {question,address,lecturerID} = req.body
    if(question !== ''){
        const AskQuestion = await new Question({
            Questions:question,
            userAsking:req.user,
            classaddress:address,
            lecturerID:lecturerID,
        })
        const newQuestion = await AskQuestion.save()
        //insert notification to database
        if(newQuestion){
            Notify(req.user,lecturerID,address,"question Asked",question)
        }
        res.json('QuestionAsked')
    }else{
        res.json('Error Asking')
    }
    
})
// Answering Question
router.post('/answer/question/:questionID',authorization,async(req,res)=>{
    const {replyTxt,address,userAsking,} = req.body
    if(replyTxt !== ''){
        const AnswerQuestion = await new Answers({
            replyTxt:replyTxt,
            UserAsked:userAsking,
            Classaddress:address,
            UserAnswering:req.user,
            questionID:req.params.questionID
        })
        const newAnswer = await AnswerQuestion.save()
        if(newAnswer){
            // insert notification to database
            Notify(req.user,userAsking,address,"Answer question",replyTxt)
            res.json(AnswerQuestion)
        }else{
            res.json('error answering')
        }
        
    }
    
})
// GET all question
router.get('/ask/question/:address',async(req,res)=>{
    const getQuestionsAsked = await Question.find({"classaddress":req.params.address}).sort({askedDate:-1})
    if(getQuestionsAsked.length > 0){
        res.json(getQuestionsAsked)
    }else{
        res.json("nothin found")
    }
})

// GET all answer
router.get('/answer/question/:classaddress/:questionID',async(req,res)=>{
    const getAnswers = await Answers.find({"classaddress":req.params.address,"questionID":req.params.questionID}).sort({DateAnswer:-1})
    if(getAnswers.length > 0){
        res.json({answers:getAnswers})
    }else{
        res.json("nothing found")
    }
})
//Questions //

//Notification//
router.get('/Notify/notification/:id',GetNotify,async(req,res)=>{
    res.json(res.GetNotify)
})

async function Notify(userFrom,userTo,address,messageType,message){
    if(userFrom,userTo,address,message){
        const notifier = new Notification({
            address:address,
            messageType:messageType,
            message:message,
            from:userFrom,
            to:userTo,
            viewed:0
        })
        const newNotifier = await notifier.save()
    }
}

//Get notofication
async function GetNotify(req,res,next){
    let GetNotify;
    GetNotify = await Notification.find({"to":req.params.id})
    if(!GetNotify){
        res.status(404).json('no notification')
    }
    res.GetNotify = GetNotify
    next()
}
//End notification//
module.exports = router
