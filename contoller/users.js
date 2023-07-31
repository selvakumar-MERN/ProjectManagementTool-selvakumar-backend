const user= require('../model/users')
const jwt= require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const joi = require("@hapi/joi")


//Verification with joi
const usersSchema = joi.object({
    firstName: joi.string().min(3).required(),
    lastName: joi.string().min(3).required(),
    email: joi.string().min(3).required().email(),
    password: joi.string().min(8).required(),
    role:joi.string().required(),
    confirmpassword: joi.string().min(8).required(),
    confirmpassword: joi.any().equal(joi.ref('password'))
        .required()
        .label('Confirm password')
        .messages({ 'any.only': '{{#label}} does not match' })
});

//Registeration of users
const register = async (req, res) => {
    const emailfound = await user.findOne({ email: req.body.email })
    if (emailfound) {
        return res.status(400).send("Email already exist")
    }

//Password encrypting
    const salt = await bcrypt.genSalt(10);
    const hashedPass = await bcrypt.hash(req.body.password, salt);
    const hashedconf = await bcrypt.hash(req.body.confirmpassword, salt);
//Creating user
    const createUser = new user({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: hashedPass,
        confirmpassword: hashedconf,
        imageUrl: process.env.DEFAULT_IMG,
        role:req.body.role
    })


    try {
        const { error } = await usersSchema.validateAsync(req.body);
        if (error) {
            res.status(400).send(error)
        }
        else {

            await createUser.save();
            return res.status(201).send("Registration sucessfull please Login");
        }
    }
    catch (error) {
        res.status(400).send(error)

    }
}


//Login
const loginSchema= joi.object({
    email:joi.string().min(3).required().email(),
    password:joi.string().min(6).required(),
})
const emaillogin= async(req,res)=>{
  const User =  await user.findOne({email:req.body.email})
     if(!User){
           return res.status(400).send("Invalid email")
     }
    
     const validPassword= await bcrypt.compare(req.body.password,User.password);
     if(!validPassword)
     return res.status(400).send("Invalid password");

     try{
        const{error}= await loginSchema.validateAsync(req.body);
        if(error){
            res.status(400).send(error)
        }
        else{
               const token=jwt.sign({email:User.email},process.env.TOKEN_SECRET);
               res.header("auth_token",token).send(token);
        }
    
     }
     catch(error){
                res.status(400).send(error)
     }
    }

// login verification
const verifylogin= async(req,res)=>{
    const {token}=req.body
    
    try{
        const verify=jwt.verify(token,process.env.TOKEN_SECRET)
        if( verify){
               await user.findOne({email:verify.email})
              .then((data)=>{ 
                res.status(200).send({data})})
                
        }
        
    }
    catch(error){
            res.status(400).send('invalid token')
    }
}
  
const getuser= async(req,res)=>{
    const{userId}=req.params
     
try{
     const find = await user.findById({_id:userId})
     res.status(200).send(find)
     
}   
catch(error){
    res.status(400).send(error)
} 
}

const updateuser= async(req,res)=>{
    const {id}=req.params
    const{firstName,lastName,email,role}=req.body
try{
      await user.updateOne({_id:id},{$set:{"firstName":firstName,"lastName":lastName,"email":email,"role":role}})
      res.status(200).send("update success")
}  
catch(error){
     res.status(400).send(error)
}  
}

    module.exports.updateuser=updateuser
    module.exports.getuser=getuser;
    module.exports.verifylogin=verifylogin;
    module.exports.register=register;
    module.exports.emaillogin=emaillogin;
