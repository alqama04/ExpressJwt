import express from 'express'
import UserController from '../controllers/userControllers.js'
import checkAuth from '../middleware/authMiddleware.js'
const router = express.Router()

router.use('/changepass',checkAuth)
router.use('/logged-user',checkAuth)

router.post('/register',UserController.userRegistration)
router.post('/login',UserController.userLogin)

// protected Route
router.post('/changepass',UserController.changePassword)
router.get('/logged-user',UserController.loggedInUser)

export default router