const jwt=require("jsonwebtoken");
const{blacklistModel}=require("../Models/blacklist.model");
const{userModel}=require("../Models/user.model");
require("dotenv").config();

const authenticate=async(req,res,next)=>{
   try {
    const token = req.headers.authorization?.split(" ")[1];

    const isBlacklisted=await blacklistModel.findOne({token});
    if(isBlacklisted){
        res.status(401).send("Token is blacklisted !")
    }else{
        const decodeToken=jwt.verify(token,process.env.JWT_S_KEY);
        const{id,username}=decodeToken;

        const user=await userModel.findById(id);
        if(!user){
            res.status(401).json({message:"pls login"})
        }
        req.user=user;

        next()
    }
   } catch (error) {
     res.status(401).json({message:"pls login 2"})
     console.log(console.error());
     
   }
}

module.exports={authenticate}
