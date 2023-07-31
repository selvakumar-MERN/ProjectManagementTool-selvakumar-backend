const express= require('express')
const app=express();
const mongoose=require('mongoose');
const cors= require('cors')
const io = require('socket.io')(8000,{
     cors:{
          origin:"http://localhost:3000"
     }
})
let activeUsers=[]
io.on("connection",(Socket)=>{
     Socket.on('new-user-add',(newUserId)=>{
          if(!activeUsers.some((user)=>user.userId===newUserId))
          {
               activeUsers.push({
                    userId:newUserId,
                    socketId:Socket.id
               })
          }
         
          io.emit('get-users',activeUsers)
     })
     Socket.on("disconnect",()=>{
          activeUsers= activeUsers.filter((user)=>user.socketId!==Socket.id)
         
          io.emit('get-users',activeUsers)
     })
})
require('dotenv').config();

const PORT= process.env.PORT || 3040;
app.use(cors({origin:true}))
const dbUrl=process.env.DB_URL;

mongoose.connect(dbUrl,{useNewUrlParser:true});

const con=mongoose.connection;
app.use(express.json({
     limit:'50mb'
}));
app.use(express.urlencoded({extended:false}));

app.listen(PORT,()=>{
    console.log('server is running at',PORT)
})
try{
     con.on('open',()=>{
        console.log('db connected')
     })
}
catch(error){
     console.log("error"+error)
}

const userRouter=require('./routes/users');
const { Socket } = require('socket.io');
app.use('/user',userRouter)
