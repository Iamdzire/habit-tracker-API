import mongoose from 'mongoose'

const authSchema = mongoose.Schema({
    name: {type: String, required: [true, "Name is required"], trim: true},
    email: {type: String, required: [true, "Email is required"], unique: true, trim: true, lowercase: true},
    password: {type: String, required: [true, "Password is required"]},
    role: {type: String, enum: ['user', 'admin'], default: 'user'}
}, {timestamps: true})

export default mongoose.model('Auth', authSchema)