const mongoose = require('mongoose');
const usersSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        min: 3,
        max: 25,
    },
    lastName: {
        type: String,
        required: true,
        min: 3,
        max: 25,
    },
    email: {
        type: String,
        required: true,
        min: 6,
        max: 50,
    },
    password: {
        type: String,
        required: true,
        min: 8,
        max: 25,
    },
    confirmpassword: {
        type: String,
        required: true,
        min: 8,
        max: 25,
    },
    tokencode: {
        type: String,
        required: false,

    },
    team: [{
        firstName: {
            type: String,
        },
        lastName: {
            type: String,
        },
        useremail: {
            type: String
        }
    }],
    Project: [{
        projectName: {
            type: String,
        },
        projectOwner: {
            type: String,
        },
        startDate: {
            type: String,
            
        },
        finishDate: {
            type: String,
        },
        status: {
            type: String,
        },
        date:{
           type:Date,
            default:new Date
        }    
    }],
    newMessages:{
        type:Object,
        default:{}
    },
    todoList:[{
        _id:{
            type:String
        },
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
           default:new Date
        }
    }],

  

});
module.exports = mongoose.model("userdetails", usersSchema)
