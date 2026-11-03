import jwt from 'jsonwebtoken'
import authModel from '../models/authModel.js'

const requireAuth = async (req, res, next) => {
    try {
        let token
        const authHeader = req.headers.authorization
        if(authHeader && authHeader.startsWith('Bearer')){
            token = authHeader.split(' ')[1]
        }
        if(!token){
            return res.status(401).json({
                error: "Unauthorized! Authentication token missing."
            })
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        if(!decoded){
            return res.status(401).json({
                error: "Unauthorized! Token invalid or expired."
            })
        }
        req.user = await authModel.findById(decoded.id).select('-password')
        if(!req.user){
            return res.status(404).json({
                error: "User profile record not found."
            })
        }
        next()
    }catch(error){
        return res.status(401).json({
            error: "Unauthorized! Token failed."
        })
    }
}


export default requireAuth