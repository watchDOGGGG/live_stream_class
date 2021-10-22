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
const SchoolDetails = require('../model/Elearning Schema/SchoolDetails')
const Department = require('../model/Elearning Schema/Departments')
const Faculty = require('../model/Elearning Schema/faculties')
const Course = require('../model/Elearning Schema/courses')

//Add new School
router.post('/InsertSchool',async(req,res)=>{
  try {
    const {schoolName,vc,location} = req.body
    if(schoolName){
        
        const checkSchool = await SchoolDetails.findOne({schoolName:schoolName})
        if(checkSchool){
           res.json({error:'school already available'})
        }else{
            const newSchool = await new SchoolDetails({
                schoolName:schoolName,
                location:'',
                vc:'',
                nos:0,
                contract:true,
                closed:true,
            })
            const saveSchool = newSchool.save()
            if(saveSchool){
               res.json({success:true})
            }else{
               res.json({error:'error saving school'})
            }
        }
    }else{
        res.json({error:'please Enter a school name'})
    }
    
  } catch (error) {
    console.log(error)
  }
})
//Add Faculties for school
router.post('/InsertFaculty',async(req,res)=>{
    try {
      const {schoolName,FacultyName} = req.body
      if(FacultyName){
          const checkSchool = await SchoolDetails.findOne({schoolName:schoolName})
          if(!checkSchool){
             res.json({error:'school not available yet'})
          }else{
              const newFaculty = await new Faculty({
                school:schoolName,
                faculty:FacultyName,
              })
              const saveFaculty = newFaculty.save()
              if(saveFaculty){
                 res.json({success:true})
              }else{
                 res.json({error:'error saving faculty'})
              }
          }
      }else{
          res.json({error:'please Enter a Faculty name'})
      }
      
    } catch (error) {
      console.log(error)
    }
  })
//   INsert Department for this faculty
  router.post('/InsertDepartment',async(req,res)=>{
    try {
      const {schoolName,facultyName,departmentName} = req.body
      if(departmentName){
          const checkFaculty = await Faculty.findOne({faculty:facultyName})
          if(!checkFaculty){
             res.json({error:`${schoolName} doesn't have this faculty yet`})
          }else{
              const newDepat = await new Department({
                school:schoolName,
                faculty:facultyName,
                department:departmentName
              })
              const saveDepat = newDepat.save()
              if(saveDepat){
                 res.json({success:true})
              }else{
                 res.json({error:'error saving Department'})
              }
          }
      }else{
          res.json({error:'please Enter a Department name'})
      }
      
    } catch (error) {
      console.log(error)
    }
  })
//INsert Courses offered by this department of the user
router.post('/InsertCourseCode',async(req,res)=>{
  try {
    const {school,department,code} = req.body
    const Check_department = await Department.findOne({school:school,department:department})
    if(!Check_department){
      res.json({error:'please an available department for this school'})
    }else{
      const newCourseCode = await new Course({
        school:school,
        department:department,
        courseCode:code
      })
      const saveCourse = await newCourseCode.save()
      res.json({success:code})
    }
    
  } catch (error) {
    console.log(error)
  }
})

//GEt All school 
router.get('/school/stats',async(req,res)=>{
   try {
    const returnResult = await SchoolDetails.find()

    if(returnResult.length <1){
        res.json({error:'no school yet'})
    }else{
      res.json({data:returnResult}) 
    }
    
    
   } catch (error) {
    console.log(error.message)
   }
})

//GEt All Faculties for school 
router.get('/GetAll/Faculties/:school',async(req,res)=>{
    try {
     const returnResult = await Faculty.find({school:req.params.school})
 
     if(returnResult.length <1){
        res.json({error:'no faculty yet'})
     }else{
      res.json({data:returnResult}) 
     }
     
     
    } catch (error) {
     console.log(error.message)
    }
 })
 //GEt All Department for this faculty 
router.get('/GetAll/Depat/:school/:faculty',async(req,res)=>{
    try {
     const returnResult = await Department.find({school:req.params.school,faculty:req.params.faculty})
 
     if(returnResult.length <1){
         res.json({error:'no department yet'})
     }else{
       res.json({data:returnResult}) 
     }
     
     
    } catch (error) {
     console.log(error.message)
    }
 })
 //GEt All CourseCode for this department 
router.get('/GetAll/Courses/:school/:depart',async(req,res)=>{
  try {
   const returnResult = await Course.find({school:req.params.school,department:req.params.depart})

   if(returnResult.length <1){
       res.json({error:'no courses yet'})
   }else{
     res.json({data:returnResult}) 
   
   }
   
  } catch (error) {
   console.log(error.message)
  }
})
// GET ALL THE COURSE IN THAT SCHOOL
// router.get('/GetAll/Courses/:school',async(req,res)=>{
//   try {
//     console.log('we',req.params.school) 
//     const returnResult = await Course.find({school:req.params.school})

//    if(returnResult.length <1){
//        res.json({error:'no courses yet'})
//    }else{
//      res.json({data:returnResult}) 
   
//    }
   
//   } catch (error) {
//    console.log(error.message)
//   }
// })

//Number of Users for school
router.get('/NumSchoolUser/:school',async(req,res)=>{
  const getNumUsers = await Users.find({"school.college":req.params.school}).countDocuments()
  console.log(getNumUsers)
})
module.exports = router