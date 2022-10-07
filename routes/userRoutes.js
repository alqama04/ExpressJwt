import express from 'express'
import UserController from '../controllers/userControllers.js'
const router = express.Router()

router.post('/register',UserController.userRegistration)


export default router