import jwt from 'jsonwebtoken'
import userModel from '../models/userModel.js'

const checkAuth = async (req, resp, next) => {
    let token
    const { authorization } = req.headers
    if (authorization && authorization.startsWith('Bearer')) {
        try {
            token = authorization.split(' ')[1]
            const { userId } = jwt.verify(token, process.env.JWT_KEY)
            req.user = await userModel.findById(userId).select('-password')
            next()
        } catch (error) {
            resp.status(401).send({ "status": "failed", "message": "Unauthorized User" })
        }
    }
    if (!token) {
        resp.status(401).send({ "status": "failed", "message": "Unauthorized User, No Token" })
    }
}



export default checkAuth