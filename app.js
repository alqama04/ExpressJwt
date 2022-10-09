// mongoose.connect('mongodb+srv://alqama:hspl123!@cluster0.n4q8zky.mongodb.net/?retryWrites=true&w=majority/mydatabase',
// {
// useNewUrlParser:true,
// useUnifiedTopology:true
// }
// ).then(()=>{
//     console.log('connected')
// })

import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv"
dotenv.config()

// custom Import
import dbConnect from './config/dbConnect.js'
import userModel from './models/userModel.js'
import userRouter from './routes/userRoutes.js'

const DB_NAME = process.env.DB_NAME
const DB_USER = process.env.DB_USER
const DB_USER_PASSWRORD = process.env.DB_USER_PASSWRORD
const DB_URL = `mongodb+srv://${DB_USER}:${DB_USER_PASSWRORD}@cluster0.n4q8zky.mongodb.net/?retryWrites=true&w=majority`
dbConnect(DB_URL,DB_NAME)

const app = express()
app.use(express.json())

app.get('/',async(_,resp)=>{
    let rst =await userModel.find()
    resp.send(rst)

})
app.use('/api/user',userRouter)


app.listen(300)