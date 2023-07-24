const user=require('../model/users')

const searchUser=async(req,res)=>{
    const{email}=req.body
try{    
    const finduser= await user.findOne({email:email})
    if(!finduser){
        return res.status(400).send(`User doesn't exist ,please ask ${email} to register with us`)
    }
    res.status(200).send(finduser)
}
catch(error){
    res.status(400).send(error)
}
}

const adduser=async(req,res)=>{
    const{email,firstName,lastName,useremail}=req.body
try{    
    await user.updateOne({email:email},{$push:{"team":{"firstName":firstName,"lastName":lastName,"useremail":useremail}}})
    res.status(200).send("User added sucessfully")
}
catch(error){
    res.status(400).send(error)
}
}

const getuser=async(req,res)=>{
    const{email}=req.body
    try{
        const findemail= await user.findOne({email:email})
    
        
        res.status(200).send(findemail.team)
    }
    catch(error){
        res.status(400).send(error)
    }    
}
module.exports.getuser=getuser
module.exports.adduser=adduser
module.exports.searchUser=searchUser;