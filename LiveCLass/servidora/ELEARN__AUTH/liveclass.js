const router = require('express').Router()
const authorization = require('../MIDDLEWARE/authorization')
var randomId = require('random-id');
const Users = require('../model/Elearning Schema/Users')
const Class = require('../model/Elearning Schema/ClassWall')
//start liveclass
router.post('/startliveclass',authorization,async(req,res)=>{
    console.log('testing live')
    const {department,course,level} = req.body
    try {
        var len = 20;
        var pattern = 'aA0'
        var id = randomId(len, pattern)
       const GetUserDT = await Users.findById(req.user)
        if(!GetUserDT){
            res.status(404).json(`can't find user`)
        }
        if(GetUserDT.accountType !=='lecturer'){
            res.status(400).json('not Authorised')
        }else{
            const startClass = await new Class({
                startedBy:GetUserDT._id ,
                address:id,
                school:{
                    college:GetUserDT.school.college,
                    department:department,
                    course:course,
                    level:level,
                },
                title:'',
                type:'live',
                expires:0,
            })
            const newClass = startClass.save()
           
            res.json(`${startClass.address}`)
        }
        
    } catch (error) {
        // res.status(500).json(error.message)
        console.log(error)
    }

})

router.get('/:class',async(req,res)=>{
  const findClass = await Class.findOne({"address":req.params.class})
  if(!findClass){
      res.status(404).json('Not found')
  }
   
})

module.exports = router