const taskmodel=require("../model/task")
const user=require('../model/users')


//Creating task by admin & also assigning task to the user & also updating todolist of the user with task
const createTask=async(req,res)=>{
    const{email,taskName,projectName,taskDescription,assignedTo,startDate,finishDate,status,docLink}=req.body
    const createTask = new taskmodel({
        taskName: taskName,
        projectName: projectName,
        taskDescription:taskDescription,
        assignedTo: assignedTo,
        assignedBy: email,
        startDate:startDate,
        finishDate:finishDate,
        status:status,
        docLink:docLink
    })

try{    
   const create= await createTask.save()
   if(!create){
       return res.status(400).send("Internal error")
   }
    await user.updateOne({email:assignedTo},{$push:{"todoList":{"_id":create._id, "taskName":taskName,"projectName":projectName,"taskDescription": taskDescription,"assignedTo":assignedTo,"assignedBy":email,"startDate":startDate,"finishDate":finishDate,"status":status,"docLink":docLink}}})
    res.status(200).send("Task assigned sucessfully")
}
catch(error){
    res.status(400).send(error)
}
}

//gettin all the task assigned by admin
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

//getting todo list of the admin & for also users
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

//when user submitting the assigned task
const inreview=async(req,res)=>{
        const{id}=req.params
        const{email,submittedlink}=req.body
        
try{
 
//during submission the task status will be updated to waiting for review & link also updated    
   const updatetask= await taskmodel.updateOne({_id:id},{$set:{"status":"waiting for review","submissionlink":submittedlink}})

   if(!updatetask){
    return res.status(400).send("internal error")
   }

//updating to-do list of user with the task status in review   
   const updatetodo =await user.updateOne({email:email,"todoList._id":id},{$set:{"todoList.$.status":"In review"}})
     
      if(!updatetodo){
        return res.status(400).send("internal service error")
       }

      
    const findtask= await taskmodel.findOne({_id:id})

//updating todo list of admin to review the task    
    const updateassignee= await user.updateOne({email:findtask.assignedBy},{$push:{"todoList":{"_id":findtask._id, "taskName":findtask.taskName,"projectName":findtask.projectName," taskDescription": findtask.taskDescription,"assignedTo":findtask.assignedTo,"assignedBy":findtask.assignedBy,"startDate":findtask.startDate,"finishDate":findtask.finishDate,"status":findtask.status,"submissionlink":findtask.submissionlink,"docLink":findtask.docLink}}})
    if(!updateassignee){
        return res.status(400).send("internal service error")
       }
       res.status(200).send("submitted for review")
}  
catch(error){
    res.status(400).send(error)
}      
}

//after the task has been reviewed by admin
const reviewedtask= async(req,res)=>{
    const{id}=req.params
    const{email,status}=req.body
try{
//updating task with status     
    const updatetask= await taskmodel.updateOne({_id:id},{$set:{"status": status}})
    if(!updatetask){
        return res.status(400).send("internal error")
       }
//updating todo list of admin       
    const updatetodo =await user.updateOne({email:email,"todoList._id":id},{$set:{"todoList.$.status":status}})
    if(!updatetodo){
        return res.status(400).send("internal service error")
       }
//updating the todolist of the user with status       
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

//editing task assigned by admin
const updatetask=async(req,res)=>{
       const {id}=req.params
       const{taskName,projectName,taskDescription,assignedTo,assignedBy,startDate,finishDate,status,docLink}=req.body
      
try{ 
    // updating the task with edited task    
    await taskmodel.updateOne({_id:id},{$set:{"taskName":taskName,"projectName":projectName,"taskDescription": taskDescription,"assignedTo":assignedTo,"assignedBy":assignedBy,"startDate":startDate,"finishDate":finishDate,"status":status,"docLink":docLink}})
    //updating the todo list of user with edited task
    await user.updateOne({email:assignedTo,"todoList._id":id},{$set:{ "todoList.$.taskName":taskName,"todoList.$.projectName":projectName,"todoList.$.taskDescription": taskDescription,"todoList.$.assignedTo":assignedTo,"todoList.$.assignedBy":assignedBy,"todoList.$.startDate":startDate,"todoList.$.finishDate":finishDate,"todoList.$.status":status,"todoList.$.docLink":docLink}})
    res.status(200).send(" Task Update sucessfully")
}
catch(error){
    res.status(400).send(error)
}
}

const deletetask=async(req,res)=>{
    const{id}=req.params
    const findtask= await taskmodel.findOne({_id:id})
try{
    await user.updateOne({email:findtask.assignedTo},{$pull:{"todoList":{"_id":id}}})
    await taskmodel.deleteOne({_id:id})
    res.status(200).send("Task deleted sucessfully")
}
catch(error){
    res.status(400).send(error)
}
}
module.exports.deletetask=deletetask
module.exports.updatetask=updatetask
module.exports.reviewedtask=reviewedtask
module.exports.inreview=inreview
module.exports.gettodoList=gettodoList
module.exports.gettask=gettask
module.exports.createTask=createTask
