const express = require('express')
const app = express()
const fileupload = require('express-fileupload')
const bodyParser = require('body-parser')
const cors = require('cors')
const mongoose = require('mongoose')
const server = require('http').Server(app)
const io = require('socket.io')(server)
const redis = require('redis')
const client = redis.createClient()
require('dotenv').config()



//CONNECT MONGOOSE
mongoose.connect(process.env.DATABASE_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
mongoose.connection.on("error", err => {
  console.log("err", err)
})
mongoose.connection.on("connected", (err, res) => {
  console.log("Connection establish")
})

// //MIDDLEWARE//
app.use(express.json())
app.use(cors())
app.use(bodyParser.json())
app.use(fileupload())
// //END MIDDLEWARE//

//redis client//
client.on('error',function(error){
  console.log(error)
})
//end redis client//

// //ROUTE//
// app.use('/authentication',require('./AUTH/palsauth'))
// app.use('/userDetails',require('./AUTH/profile'))
// app.use('/postUpload',require('./AUTH/post'))
// app.use('/profile',require('./AUTH/profile'))
// app.use('/alldata',require('./AUTH/alldata'))
app.use('/Auth',require('./ELEARN__AUTH/Auth'))
app.use('/ClassWalls',require('./ELEARN__AUTH/ClassWalls'))
app.use('/liveclass',require('./ELEARN__AUTH/liveclass'))
app.use('/admin',require('./ELEARN__AUTH/admin'))
// //END ROUTE//


//liveclass

const users = {} 
const admins = {}


io.on('connection',socket =>{

socket.on('create-class',(address,socketID)=>{
  //save to redis so all client can connect to this socket
  client.set("adminsocket",socketID,(err)=>{
    if(err)throw err;
  })
  
})
socket.on('join-class',async(classId,palsid)=>{
      socket.join(classId)
//Fetch the socket.id from redis
client.get("adminsocket",(err,socketID)=>{
  if(err) throw err
    io.to(socketID).emit('user-connected', palsid);
})
   
      //on disconnection
      socket.on('disconnect',()=>{
          socket.to(classId).broadcast.emit('user-disconnect',palsid)
      })

   
  })
  
  //live message
  socket.on('join-class',(classId)=>{
      socket.join(classId)
  })

  socket.on('send-chat-message',(classId,user,message)=>{
    users[socket.id] = user
    socket.to(classId).broadcast.emit('chat-message',{message:message,
    name:users[socket.id]})

})
      
})

server.listen(4000, ()=>{
    console.log('server is running on port 4000')
})