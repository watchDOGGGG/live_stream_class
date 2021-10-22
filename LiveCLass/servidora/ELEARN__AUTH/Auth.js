const router = require('express').Router()
const jwtToken = require('../GENERATORS/jwtGen')
const bcrypt = require('bcrypt')
var randomId = require('random-id');
const authorization = require('../MIDDLEWARE/authorization')
const Users = require('../model/Elearning Schema/Users')
const Class = require('../model/Elearning Schema/ClassWall')
const NoteArchive = require('../model/Elearning Schema/noteArchive')
const Verify = require('../model/Elearning Schema/verify')
const Epool = require('../model/PalscheckDB/palsEDB')
const { update } = require('../model/Elearning Schema/Users')
const nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'randyodu@gmail.com',
      pass: 'Watchdogs1'
    }
  });
// register users into database
router.post('/EL__register', async(req,res)=>{
    try {
        const {firstname,lastname,email,password,college,faculty,
        department,accountType,identity,gender,level} = req.body
        const fullname = firstname+" "+lastname
        
        const saltRounds = 10;
        const salt = bcrypt.genSaltSync(saltRounds);
        const newPassword = bcrypt.hashSync(password, salt); 
        
        var len = 5;
        var pattern = '0'
        var pin = randomId(len, pattern)

        const CheckUser = await Users.findOne({$or:[{email:email},{identification:identity}]})
        if(!CheckUser){
            const NewUser = new Users({
                fullname:fullname,
                email:email,
                password:newPassword,
                school:{
                    college:college,
                    faculty:faculty,
                    department:department,
                },
                level:level,
                accountType:accountType,
                identification:identity,
                gender:gender,
                verified:1,
            })
            const enter = await NewUser.save()
            res.json({done:1})
            //  var mailOptions = {
            //             from: 'randyodu@gmail.com',
            //             to: email,
            //             subject: 'Verification code',
            //             html: `<h1 style="color:light-blue,font-weight:bold,text-transform-uppercase">Palscheck-elearning Verification code</h1>
            //             <p>Enter the verification code below in the vefiaction box to verify your account. note if you dont verify your account you won't have access to your user dashbord,
            //             and keep your verification code secret thank you palscheck-elearning</p>
            //             <p style="color:black,font-weight:bold,text-align:center, font-size:20px">${pin}</p>`
            //           };
            //           transporter.sendMail(mailOptions, async function(error, info){
            //             if (error) {
            //               res.json('failed please check your email or other details or network connection');
            //             }else {
            //                 // const InsertUser = await NewUser.save()
            //                 if(InsertUser){
            //                     const newVerify = new Verify({
            //                     UserID:InsertUser._id,
            //                     VerifyPin:pin
            //                 })
            //                 const Verified = await newVerify.save()
            //                 }
            //             }
            //           }); 
            
        }else{
            res.status(400).json('User with this identity number or email already exist') 
        }
        
        
    } catch (error) {
        res.status(500).json(error.message)
    }
})

// login users
router.post('/EL__login',async(req,res)=>{
    try {
        const {email,password} = req.body
        const CheckUser = await Users.findOne({$or:[{identification:email},{email:email},]})
        if(!CheckUser){
            res.status(400).json('No user found with this identity')
        }else{
            const Ispassword = await bcrypt.compare(password,CheckUser.password)
        if(!Ispassword){
            res.status(400).json('password Incorrect')
        }else{
            const checkverified = await Users.findOne({"_id":CheckUser._id,verified:1})
            if(checkverified){
                const token = jwtToken(CheckUser._id)
                res.json({token})
            }else{
                res.json('not verified')
            }
            
        }
        
        }
        
        
    } catch (error) {
        res.status(500).json(error.message)
    }
})
// verify token
router.get('/verifyJwt',authorization,async(req,res)=>{
    try {
        res.json({verify:true})
    } catch (error) {
        res.status(500).json(error.message)
    }
})
// verify pin
router.patch('/verify/pin',async(req,res)=>{
    const {pin} = req.body
    const checkPin = await Verify.findOne({"VerifyPin":pin})
    if(checkPin){
       
        const UpdateVerified = await Users.updateOne(
           {"_id":checkPin.UserID},
           {$set:{verified:1}}
           )
        res.json('sucess')
    }else{
        res.json('wrong pin')
    }

})

// get one user
router.get('/:id',authorization,GetAllUserdata,async(req,res)=>{
    res.json(res.GetUserDT)

})

// getAcc type
router.get('/Auth/CheckAccty',authorization,async(req,res)=>{
    const palsid = req.user
    const getAccty = await Users.findById(palsid)
    res.json({id:getAccty._id,acctype:getAccty.accountType})
})
// get user Institutions
router.get('/Auth/institution',authorization,async(req,res)=>{
    const palsid = req.user
    const getInist = await Users.findById(palsid)
    res.json({college:getInist.school.college,faculty:getInist.school.faculty,department:getInist.school.department})
})

// get All user
router.get('/getAll/All',async(req,res)=>{
    try {
       const getAll = await Users.find()
        if(!getAll){
            res.status(404).json(`no user found`)
        }
    res.json(getAll)
    } catch (error) {
        res.status(500).json(error.message)
    }
})
// get courseHandle
router.get('/course/:id',authorization,GetAllUserdata,async(req,res)=>{
    const course  = res.GetUserDT.coursesHandled
    const responseArray = [];
 
    for (let index = 0; index < course.length; index++) {
       responseArray.push( course[index].courseCode ); 
    }
    res.json(responseArray)
    
})
// get courseHandle with Array
router.get('/courseArray/:id',authorization,GetAllUserdata,async(req,res)=>{
    const course  = res.GetUserDT.coursesHandled
    
    res.json(course)
    
})
//update user

// save all course handled/update course
router.patch('/courseUpdate',authorization,async(req,res)=>{
    try {
        const {course} = req.body        
          const upDateUser = await Users.updateOne(
            {_id:req.user},{$addToSet:{coursesHandled:{courseCode:course}}}
          )
          res.json({done:upDateUser})
      
    } catch (error) {
        res.status(500).json(error.message)
    }
})

//get user id of logged in 
router.get('/UserID/id',authorization,async(req,res)=>{
    res.json(req.user)
})
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
//get all user files
router.get('/getAllClass/class',authorization,async(req,res)=>{
    const getAllClass = await Class.find({"startedBy":req.user})
    if(getAllClass){
        res.json(getAllClass)
    }
})
router.get('/getAll/files/:address',async(req,res)=>{
    const getAllfiles = await Epool.query("SELECT * FROM palsemedia WHERE __address =$1 AND filetype=$2",[req.params.address,'video/mp4'])
    if(getAllfiles){
        res.json(getAllfiles.rows)
    }else{
        res.status(404).json('no file found')
    }
})
router.get('/getAll/docfiles/:address',async(req,res)=>{
    const getAllfiles = await Epool.query("SELECT * FROM palsemedia WHERE __address =$1 AND filetype=$2",[req.params.address,'application/pdf'])
    if(getAllfiles){
        res.json(getAllfiles.rows)
    }else{
        res.status(404).json('no file found')
    }
})
//get All student save files
// get save note
router.get('/savenote/notes',authorization,async(req,res)=>{
    const palsid = req.user
    const checkNOte = await NoteArchive.find({"userID":req.user})
    if(checkNOte.length > 0){
        res.json(checkNOte)
    } 
})

router.post('/send/email',async(req,res)=>{
    
     
})
module.exports = router