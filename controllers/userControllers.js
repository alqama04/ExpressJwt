import mongoose from "mongoose";
import bcrypt from 'bcrypt'
import userModel from "../models/userModel.js";
import jwt from 'jsonwebtoken'
const jwtKey='143242390rf&*(W)Q()Q)(W*EU)(E_Q(EU_(QWEUQWUEM(E(*E&NC*(&E*&#(*@!)@&)!!213!@3!#!@EWDFWSFsdfasGT#RTfdsvdsdsgewt'
class UserController {
    static userRegistration = async (req, resp) => {
        const { name, email, password, confirm_password, tc } = req.body
        const user = await userModel.findOne({ email: email })
        if (user) {
            resp.send({ "status": "failed", "message": "User already exits with this email" })
        } else {
            if (name && email && password && confirm_password && tc) {
                if (password === confirm_password) {
                    const salt = await bcrypt.genSalt(15)
                    const pwdHash = await bcrypt.hash(password, salt)
                    try {
                        let currentUser = new userModel({
                            name: name,
                            email: email,
                            password: pwdHash,
                            tc: tc
                        })
                       const saved_user =  await currentUser.save()
                       const token = jwt.sign({UserId:saved_user.id},jwtKey,{expiresIn:"2d"})
                        resp.send({ "message": "user Created successfully","token":token,"savedId":saved_user.id })
                    } catch {
                        resp.send({ "status": "failed", "message": "something went wrong" })
                    }

                } else {
                    resp.send({ "status": "failed", "message": "two password fields did not match" })
                }
            } else {
                resp.send({ "status": "failed", "message": "all fields are required" })
            }
        }
    }
    static userLogin = async (req, res) => {
        try {
          const { email, password } = req.body
          if (email && password) {
            const user = await userModel.findOne({ email: email })
            if (user != null) {
              const isMatch = await bcrypt.compare(password, user.password)
              if ((user.email === email) && isMatch) {
                // Generate JWT Token
                const token = jwt.sign({userId:user.id},jwtKey,{expiresIn:"2d"})
                res.send({ "status": "success", "message": "Login Success", "token": token })
              } else {
                res.send({ "status": "failed", "message": "Email or Password is not Valid" })
              }
            } else {
              res.send({ "status": "failed", "message": "You are not a Registered User" })
            }
          } else {
            res.send({ "status": "failed", "message": "All Fields are Required" })
          }
        } catch (error) {
          console.log(error)
          res.send({ "status": "failed", "message": "Unable to Login" })
        }
      }
    
}
export default UserController