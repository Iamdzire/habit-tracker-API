import mongoose from 'mongoose'

const authSchema = mongoose.Schema({
    name: {type: String, required: [true, "User name is required"], trim: true},
    email: {type: String, required: [true, "User email is required"], unique: true, trim: true, lowercase: true},
    password: {type: String, required: [true, "User password is required"], trim: true}
})

export default mongoose.model('Auth', authSchema)