import mongoose from "mongoose";
import bcrypt from 'bcrypt'
import userModel from "../models/userModel.js";
import jwt from 'jsonwebtoken'
import transporter from "../config/emailConfig.js";

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
            const saved_user = await currentUser.save()
            const token = jwt.sign({ userId: saved_user.id }, process.env.JWT_KEY, { expiresIn: "2d" })
            resp.send({ "message": "user Created successfully", "token": token, "savedId": saved_user.id })
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
  static userLogin = async (req, resp) => {
    try {
      const { email, password } = req.body
      if (email && password) {
        const user = await userModel.findOne({ email: email })
        if (user != null) {
          const isMatch = await bcrypt.compare(password, user.password)
          if ((user.email === email) && isMatch) {
            // Generate JWT Token
            const token = jwt.sign({ userId: user.id }, process.env.JWT_KEY, { expiresIn: "2d" })
            resp.send({ "status": "success", "message": "Login Success", "token": token })
          } else {
            resp.send({ "status": "failed", "message": "Email or Password is not Valid" })
          }
        } else {
          resp.send({ "status": "failed", "message": "You are not a Registered User" })
        }
      } else {
        resp.send({ "status": "failed", "message": "All Fields are Required" })
      }
    } catch (error) {
      resp.send({ "status": "failed", "message": "Unable to Login" })
    }
  }

  static changePassword = async (req, resp) => {
    const { password, password_confirmation } = req.body
    if (password && password_confirmation) {
      if (password !== password_confirmation) {
        resp.send({ "status": "failed", "message": "New Password and Confirm New Password doesn't match" })
      } else {
        const salt = await bcrypt.genSalt(10)
        const newHashPassword = await bcrypt.hash(password, salt)
        await userModel.findByIdAndUpdate(req.user._id, { $set: { password: newHashPassword } })
        resp.send({ "status": "success", "message": "Password changed succesfully" })
      }
    } else {
      resp.send({ "status": "failed", "message": "All Fields are Required" })
    }
  }

  static loggedInUser = async (req, resp) => {
    console.log('user is authenticated')
    resp.send({ "user": req.user })
  }

  static userPasswordResetEmail = async (req, resp) => {
    const { email } = req.body
    if (email) {
      const user = await userModel.findOne({ email: email })
      if (user) {
        const secret = user._id + process.env.JWT_KEY
        const token = jwt.sign({ userId: user._id }, secret, { expiresIn: "10m" })
        const link = `http://127.0.0.1:3000/api/user/reset/${user._id}/${token}`
        console.log(link)
        // send Email 
        let info = await transporter.sendMail({
          from:process.env.EMAIL_FROM,
          to:email,
          subject:"auth Project password reset Link",
          html:`<a href=${link}>click Here to reset Your Password</a>`
        })

        resp.send({ "status": "success", "message": "Password Reset Email Sent ........ Please check your Email",})
      } else {
        resp.send({ "status": "failed", "message": "Email Doesn't exist " })
      }
    } else {
      resp.send({ "status": "failed", "message": "Email Field is required" })
    }
  }

  static userPasswordReset = async (req, resp) => {
    const { password, confirm_password } = req.body
    const { id, token } = req.params
    const user = await userModel.findById(id)
    if (user) {
      const new_secret_key = user._id + process.env.JWT_KEY
      try {
        jwt.verify(token, new_secret_key)
        if (password && confirm_password) {
          if (password === confirm_password) {
            const salt = await bcrypt.genSalt(15)
            const pwdHash = await bcrypt.hash(password, salt)
            await userModel.findByIdAndUpdate(user._id, { $set: { password: pwdHash } })
            resp.send({ "status": "success", "message": "Password Reset Successfully" })
          } else {
            resp.send({ "message": "password fields did not match" })
          }
        } else {
          resp.send({ "message": "all fieds are required" })
        }

      } catch (error) {
        resp.send({ "status": "failed", "message": "Invalid Token" })
      }
    } else {
      resp.send({ "status": "failed" })
    }
  }
}
export default UserController