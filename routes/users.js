const express= require('express')
const forgotpassword= require('../contoller/forgotpassword')
const userdata= require('../contoller/users')
const router =express.Router();
const projectData=require('../contoller/project')
const teamData=require('../contoller/team')
const taskData=require('../contoller/task')
const chatData=require('../contoller/chat')
const messageData=require('../contoller/messages')
//user details
router.post('/register',userdata.register)
router.post('/login',userdata.emaillogin)
router.post('/loginverify',userdata.verifylogin)
router.get('/:userId',userdata.getuser)


//forgot password
router.post('/passwordreset',forgotpassword.emailverify)
router.post('/passwordreset/:token',forgotpassword.verifytoken)
router.post('/resetpassword',forgotpassword.resetpassword)

//project details
router.post('/createproject',projectData.createProject)
router.post('/projects',projectData.getProject)

//team
router.post('/search',teamData.searchUser)
router.post('/adduser',teamData.adduser)
router.post('/getusers',teamData.getuser)

//task
router.post('/createtask',taskData.createTask)
router.post('/gettask',taskData.gettask)
router.post('/gettodo',taskData.gettodoList)
router.post('/inreview/:id',taskData.inreview)
router.post('/reviewedtask/:id',taskData.reviewedtask)

//chat
router.post('/chat',chatData.createChat)
router.get('/chat/:userId',chatData.userchats)
router.get('/chat/find/:firstId/:secondId',chatData.findchat)

//messages
router.post('/messages',messageData.addmessage)
router.get('/messages/:chatId',messageData.getmessage)

module.exports=router