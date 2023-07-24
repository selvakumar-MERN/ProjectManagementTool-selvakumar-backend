const user=require('../model/users')
const createProject=async(req,res)=>{
    const{email,projectName,projectOwner,startDate,finishDate,status}=req.body
try{    
    await user.updateOne({email:email},{$push:{"Project":{"projectName":projectName,"projectOwner":projectOwner,"startDate":startDate,"finishDate":finishDate,"status":status}}})
    res.status(200).send("Project created sucessfully")
}
catch(error){
    res.status(400).send(error)
}
}

const getProject=async(req,res)=>{
    const {email}=req.body
    
try{
    const findemail= await user.findOne({email:email})

    
    res.status(200).send(findemail.Project)
}
catch(error){
    res.status(400).send(error)
}

}
module.exports.getProject=getProject;
module.exports.createProject=createProject;