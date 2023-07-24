const chatmodel= require('../model/chat')

const createChat= async(req,res)=>{
    const newchat= new chatmodel({
        members:[req.body.senderId,req.body.receiverId]
    })
try{
      const result =await newchat.save();
      res.status(200).send(result)
}
catch(error){
     res.status(400).send(error)
}    
}

const userchats= async(req,res)=>{
    try{
         const chat= await chatmodel.find({
            members:{$in:[req.params.userId]}

         })
         res.status(200).send(chat)
    }
    catch(error){
        res.status(400).send(error)
   }  
}

const findchat= async(req,res)=>{
    try{
           const chat = await chatmodel.findOne({
            members:{$all:[req.params.firstId,req.params.secondId]}
           })
           res.status(200).send(chat)
    }
    catch(error){
        res.status(400).send(error)
   }  
}
module.exports.createChat=createChat;
module.exports.userchats=userchats;
module.exports.findchat=findchat;