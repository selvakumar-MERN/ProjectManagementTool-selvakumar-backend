const {uploadToCloudinary,removeFromCloudinary}=require('../contoller/cloudinary')
const user= require('../model/users')

const uploadimage= async(req,res)=>{
     try{
        const data= await uploadToCloudinary(req.body.profileimage,"user-images");

        const savedimg= await user.updateOne({_id:req.params.id},
            {
                $set:{
                    imageUrl:data.url,
                    publicId:data.public_id,
                },
            });
            res.status(200).send("Image upload sucessfull")
     }
     catch(error){
        res.status(400).send(error)
     }
}

const deleteimage=async(req,res)=>{
 try{
    const users= await user.findOne({_id:req.params.id})

    const publicId= users.publicId;
    await removeFromCloudinary(publicId)

    await user.updateOne({_id:req.params.id},
        {
            $set:{
                imageUrl:process.env.DEFAULT_IMG,
                publicId:"",
            },
        });
      res.status(200).send("Profile image deleted sucessfully")
 }  
 catch(error){
    res.status(400).send(error)
 } 
}

module.exports.uploadimage=uploadimage;
module.exports.deleteimage=deleteimage;