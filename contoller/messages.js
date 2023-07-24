const messagemodel= require('../model/message')

const addmessage= async(req,res)=>{
     const{chatId,senderId,text}=req.body
     const message=new messagemodel({
        chatId,
        senderId,
        text
     });
try{
    const result =await message.save();
    res.status(200).send(result)
}     
catch(error){
    res.status(400).send(error)
}
}

const getmessage=async(req,res)=>{
    const{chatId}=req.params;
    try{
        const result= await messagemodel.find({chatId})
        res.status(200).send(result)
    }
    catch(error){
        res.status(400).send(error)
    }
}
module.exports.addmessage=addmessage;
module.exports.getmessage=getmessage;