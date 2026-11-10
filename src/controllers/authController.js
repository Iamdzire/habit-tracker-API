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
        /* const existingUser = await authModel.findOne({email})
        if(existingUser){
            return res.status(400).json({
                error: "A User with this email already exists."
            })
        } */
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        const newUser = new authModel({
            name,
            email,
            password: hashedPassword,
        })
        await newUser.save()

        const newUserDetails = await authModel
        .findById(newUser._id)
        .select('-password')

        return res.status(201).json({
            message: "User created successfully.",
            data: newUserDetails
        })
    }catch(error){
        if(error.code === 11000){
            return res.status(400).json({
                error: "A user with this email already exists." // See how i can handle this error in two different ways
            })
        }
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
                role: user.role,
                id: user._id
            }
        })
    }catch(error){
        return res.status(500).json({
            error: error.message
        })
    }
}


export const getAllUsers = async (req, res) => {
    try {
        const {page, limit, name, email, role, sort} = req.query
        const pageNumber = Number(page) || 1
        const limitNumber = Number(limit) || 4
        const skip = (pageNumber - 1) * limitNumber

        const filter = {}
        if(name){
            filter.name = {$regex: name, $options: 'i'}
        }
        if(email){
            filter.email = {$regex: email, $options: 'i'}
        }
        if(role){
            filter.role = {$regex: role, $options: 'i'}
        }

        let sortOption = {createdAt: -1, _id: -1} // Default: Newest to oldest
        if(sort === 'name'){
            sortOption = {name: 1, _id: 1}
        }
        if(sort === 'email'){
            sortOption = {email: 1, _id: 1}
        }
        if(sort === 'role'){
            sortOption = {role: 1, _id: 1}
        }

        const users = await authModel
        .find(filter)
        .sort(sortOption)
        .select('-password')
        .skip(skip)
        .limit(limitNumber)

        if(users.length === 0){
            return res.status(404).json({
                error: "No user found."
            })
        }
        const total = await authModel.countDocuments(filter)
        const totalPages = Math.ceil(total / limitNumber)
        return res.status(200).json({
            message: "All users fetched successfully.",
            data: {
                users,
                page: pageNumber,
                limit: limitNumber,
                total,
                totalPages
            }
        })
    }catch(error){
        return res.status(500).json({
            error: error.message
        })
    }
}


export const getSingleUser = async (req, res) => {
    try {
        const {id} = req.params
        const user = await authModel
        .findById(id)
        .select('-password')

        if(!user){
            return res.status(404).json({
                error: "User not found."
            })
        }
        if(req.user._id.toString() !== user._id.toString() && req.user.role !== 'admin'){
            return res.status(403).json({
                error: "Permission insufficient."
            })
        }
        return res.status(200).json({
            message: "User fetched successfully.",
            data: user
        })
    }catch(error){
        return res.status(500).json({
            error: error.message
        })
    }
}


export const updateUser = async (req, res) => {
    try {
        const {id} = req.params
        const {name, email, password, confirmPassword} = req.body
        const user = await authModel
        .findById(id)

        if(!user){
            return res.status(404).json({
                error: "User not found."
            })
        }
        if(req.user._id.toString() !== user._id.toString() && req.user.role !== 'admin'){
            return res.status(403).json({
                error: "Permission insufficient"
            })
        }
        let putName = user.name
        let putEmail = user.email
        let putPassword = user.password

        if(name){
            putName = name
        }
        if(email){
            if(email !== user.email){
            const existingEmail = await authModel.findOne({email})
            if(existingEmail){
                return res.status(400).json({
                    error: "Email already in use by another user."
                })
            }
            putEmail = email
        }}
        if(email === putEmail){
            putEmail = email
        }
        if(password){
            if(password.length <= 5){
            return res.status(400).json({
                error: "Password must be at least 6 characters in length."
            })
        }
            if(password === confirmPassword){
            const salt = await bcrypt.genSalt(10)
            const hashedPassword = await bcrypt.hash(password, salt)
            putPassword = hashedPassword
        }else{
            return res.status(400).json({
                error: "Passwords do not match."
            })
        }
    }
    if(password !== confirmPassword){
        return res.status(400).json({
            error: "Passwords do not match."
        })
    }
        user.name = putName
        user.email = putEmail
        user.password = putPassword
        await user.save()

        const updatedUser = await authModel
        .findById(id)
        .select('-password')

        return res.status(200).json({
            message: "User updated successfully.",
            data: updatedUser
        })
    }catch(error){
        return res.status(500).json({
            error: error.message
        })
    }
}


export const deleteUser = async (req, res) => {
    try {
        const {id} = req.params
        const user = await authModel
        .findById(id)
        .select('-password')

        if(!user){
            return res.status(404).json({
                error: "User not found."
            })
        }
        if(req.user._id.toString() !== user._id.toString() && req.user.role !== 'admin'){
            return res.status(403).json({
                error: "Permission insufficient."
            })
        }
        await authModel.findByIdAndDelete(id)

        return res.status(200).json({
            error: "User deleted successfully.",
            data: user
        })
    }catch(error){
        return res.status(500).json({
            error: error.message
        })
    }
}