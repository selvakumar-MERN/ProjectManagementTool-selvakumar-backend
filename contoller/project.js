const user=require('../model/users')

//Creating a project by admin
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

//getting the project created by admin
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

//editing the project by admin
const updateproject=async(req,res)=>{
    const{id}=req.params
    const{projectName,projetOwner,startDate,finishDate,status}=req.body
try{    
    const find= await user.findOne({Project:{$elemMatch:{_id:id}}})
    
     await user.updateOne({email:find.email,"Project._id":id},{$set:{"Project.$.projectName":projectName,"Project.$.projetOwner":projetOwner,"Project.$.startDate":startDate,"Project.$.finishDate":finishDate,"Project.$.status":status}})
       res.status(200).send("Update sucessfully")
}
catch(error)
{
    res.status(400).send(error)
}
}

//Deleting the project by admin
const deleteproject=async(req,res)=>{
    const{id}=req.params
    const{email}=req.body
    console.log(id,email)
 try{
       await user.updateOne({email:email},{$pull:{"Project":{"_id":id}}})
       res.status(200).send(" Project Deleted sucessfully")
 } 
 catch(error){
       res.status(400).send(error)
 }  
}
module.exports.deleteproject=deleteproject;
module.exports.updateproject=updateproject;
module.exports.getProject=getProject;
module.exports.createProject=createProject;
