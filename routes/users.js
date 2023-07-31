const express= require('express')
const forgotpassword= require('../contoller/forgotpassword')
const userdata= require('../contoller/users')
const router =express.Router();
const projectData=require('../contoller/project')
const teamData=require('../contoller/team')
const taskData=require('../contoller/task')
const chatData=require('../contoller/chat')
const messageData=require('../contoller/messages')
const imagedata=require('../contoller/profileimg')
const upload= require('../middleware/upload')
//user details
router.post('/register',userdata.register)
router.post('/login',userdata.emaillogin)
router.post('/loginverify',userdata.verifylogin)
router.get('/:userId',userdata.getuser)
router.post('/upload/profile/:id',upload.single('profileimage'),imagedata.uploadimage)
router.delete('/profile/delete/:id',imagedata.deleteimage)
router.patch('/updateuser/:id',userdata.updateuser)

//forgot password
router.post('/passwordreset',forgotpassword.emailverify)
router.post('/passwordreset/:token',forgotpassword.verifytoken)
router.post('/resetpassword/:token',forgotpassword.resetpassword)

//project details
router.post('/createproject',projectData.createProject)
router.post('/projects',projectData.getProject)
router.post('/deleteproject/:id',projectData.deleteproject)
router.patch('/updateproject/:id',projectData.updateproject)

//team
router.post('/search',teamData.searchUser)
router.post('/adduser',teamData.adduser)
router.post('/getusers',teamData.getuser)
router.post('/deleteuser/:id',teamData.deleteuser)

//task
router.post('/createtask',taskData.createTask)
router.post('/gettask',taskData.gettask)
router.post('/gettodo',taskData.gettodoList)
router.post('/inreview/:id',taskData.inreview)
router.post('/reviewedtask/:id',taskData.reviewedtask)
router.patch('/updatetask/:id',taskData.updatetask)
router.post('/deletetask/:id',taskData.deletetask)

//chat
router.post('/chat',chatData.createChat)
router.get('/chat/:userId',chatData.userchats)
router.get('/chat/find/:firstId/:secondId',chatData.findchat)

//messages
router.post('/messages',messageData.addmessage)
router.get('/messages/:chatId',messageData.getmessage)

module.exports=router
