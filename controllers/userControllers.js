import mongoose from "mongoose";
import bcrypt from 'bcrypt'
import userModel from "../models/userModel.js";

class UserController{
    static userRegistration = async(req,resp)=>{
        const {name,email,password,confirm_password,tc} = req.body
        const user = await userModel.findOne({email:email})
        if (user){
            resp.send({"status":"failed","message":"User already exits with this email"})
        } else{
        if (name && email && password && confirm_password && tc){
            if(password === confirm_password){
               const salt = await bcrypt.genSalt(17)
               const pwdHash = await bcrypt.hash(password,salt)
                try{
                    let currentUser = new userModel({
                        name:name,
                        email:email,
                        password:pwdHash,
                        tc:tc
                    })
                    await currentUser.save()
                    resp.send({"message":"user Created successfully"})
                }catch{
                    resp.send({"status":"failed","message":"something went wrong"})
                }

            }else{
                resp.send({"status":"failed","message":"two password fields did not match"})
            }
        }else{
            resp.send({"status":"failed","message":"all fields are required"})
        }
    } 
    }
}

export default UserController