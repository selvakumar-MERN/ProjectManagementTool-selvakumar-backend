const mongoose = require('mongoose');

const taskSchema=new mongoose.Schema({
    taskName:{
        type:String
    },
    projectName:{
        type:String
    },
    taskDescription:{
        type:String
    },
    assignedTo:{
        type:String
    },
    assignedBy:{
        type:String
    },
   
    startDate:{
        type:String
    },
    finishDate:{
        type:String
    },
    status:{
        type:String
    },
    submissionlink:{
           type:String
    },
    date:{
        type:Date,
        default:new Date,
    }
}
)
module.exports= mongoose.model("tasks",taskSchema)
