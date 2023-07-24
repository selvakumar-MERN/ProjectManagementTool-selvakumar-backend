
const taskmodel=require("../model/task")
const user=require('../model/users')

const createTask=async(req,res)=>{
    const{email,taskName,projectName,taskDescription,assignedTo,startDate,finishDate,status}=req.body
    const createTask = new taskmodel({
        taskName: taskName,
        projectName: projectName,
        taskDescription:taskDescription,
        assignedTo: assignedTo,
        assignedBy: email,
        startDate:startDate,
        finishDate:finishDate,
        status:status
    })

try{    
   const create= await createTask.save()
   if(!create){
       return res.status(400).send("Internal error")
   }
    await user.updateOne({email:assignedTo},{$push:{"todoList":{"_id":create._id, "taskName":taskName,"projectName":projectName,"taskDescription": taskDescription,"assignedTo":assignedTo,"assignedBy":email,"startDate":startDate,"finishDate":finishDate,"status":status}}})
    res.status(200).send("Task assigned sucessfully")
}
catch(error){
    res.status(400).send(error)
}
}

const gettask=async(req,res)=>{
    const{email}=req.body
    
try{    
    const find= await taskmodel.find({assignedBy:email}).sort({"date":-1})
    res.status(200).send(find)
}
catch(error){
    res.status(400).send(error)
}
}

const gettodoList=async(req,res)=>{
    const {email}=req.body
try{
     const find= await user.findOne({email:email})
     res.status(200).send(find.todoList)
}
catch(error){
    res.status(400).send(error)
}
}
const inreview=async(req,res)=>{
        const{id}=req.params
        const{email,submittedlink}=req.body
        
try{
   const updatetask= await taskmodel.updateOne({_id:id},{$set:{"status":"waiting for review","submissionlink":submittedlink}})
  //
   if(!updatetask){
    return res.status(400).send("internal error")
   }
  
   const updatetodo =await user.updateOne({email:email,"todoList._id":id},{$set:{"todoList.$.status":"In review"}})
     // 
      if(!updatetodo){
        return res.status(400).send("internal service error")
       }

      res.status(200).send("submitted for review")
    const findtask= await taskmodel.findOne({_id:id})
    
    const updateassignee= await user.updateOne({email:findtask.assignedBy},{$push:{"todoList":{"_id":findtask._id, "taskName":findtask.taskName,"projectName":findtask.projectName," taskDescription": findtask.taskDescription,"assignedTo":findtask.assignedTo,"assignedBy":findtask.assignedBy,"startDate":findtask.startDate,"finishDate":findtask.finishDate,"status":findtask.status,"submissionlink":findtask.submissionlink}}})
    if(!updateassignee){
        return res.status(400).send("internal service error")
       }
}  
catch(error){
    res.status(400).send(error)
}      
}

const reviewedtask= async(req,res)=>{
    const{id}=req.params
    const{email,status}=req.body
try{
    const updatetask= await taskmodel.updateOne({_id:id},{$set:{"status": status}})
    if(!updatetask){
        return res.status(400).send("internal error")
       }
    const updatetodo =await user.updateOne({email:email,"todoList._id":id},{$set:{"todoList.$.status":status}})
    if(!updatetodo){
        return res.status(400).send("internal service error")
       }
    const findtask= await taskmodel.findOne({_id:id})
    
    const updateassignee= await user.updateOne({email:findtask.assignedTo,"todoList._id":id},{$set:{"todoList.$.status":status}})
    if(!updateassignee){
        return res.status(400).send("internal service error")
       }
       res.status(200).send("Task evaluated sucessfully")
}   
catch(error){
    res.status(400).send(error)
} 
}
module.exports.reviewedtask=reviewedtask
module.exports.inreview=inreview
module.exports.gettodoList=gettodoList
module.exports.gettask=gettask
module.exports.createTask=createTask