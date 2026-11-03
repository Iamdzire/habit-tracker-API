import authModel from '../models/authModel.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

export const createUser = async (req, res) => {
    try {
        const {name, email, password, confirmPassword} = req.body
        if(!name || !email || !password || !confirmPassword){
            return res.status(400).json({
                error: "All required fields must be filled."
            })
        }
        if(password !== confirmPassword){
            return res.status(400).json({
                error: "Passwords do not match."
            })
        }
        const existingUser = await authModel.findOne({email})
        if(existingUser){
            return res.status(400).json({
                error: "Email already exists."
            })
        }
        const genSalt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, genSalt)

        const newUser = new authModel({
            name,
            email,
            password: hashedPassword
        })
        await newUser.save()

        return res.status(201).json({
            message: "User created successfully.",
            data: {
                id: newUser._id,
                name: newUser.name,
                email: newUser.email
            }
        })
    }catch(error){
        return res.status(500).json({
            error: error.message
        })
    }
}


export const loginUser = async (req, res) => {
    try {
        const {email, password} = req.body
        if(!email || !password){
            return res.status(400).json({
                error: "All required fields must be filled."
            })
        }
        const user = await authModel.findOne({email})
        if(!user){
            return res.status(401).json({
                error: "Invalid email or password."
            })
        }
        const isMatch = await bcrypt.compare(password, user.password)
        if(!isMatch){
            return res.status(401).json({
                error: "Invalid email or password."
            })
        }
        const token = jwt.sign(
            {id: user._id},
            process.env.JWT_SECRET,
            {expiresIn: process.env.JWT_EXPIRES_IN}
        )

        return res.status(200).json({
            message: "Login successful.",
            data: {
                token,
                name: user.name,
                email: user.email,
                id: user._id
            }
        })
    }catch(error){
        return res.status(500).json({
            error: error.message
        })
    }
}