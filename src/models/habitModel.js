import mongoose from 'mongoose'

const habitSchema = mongoose.Schema({
    name: {type: String, required: [true, "Name is required"], trim: true},
    description: {type: String, trim: true},
    frequency: {type: String, required: [true, "Frequency is required"], enum: ["Daily", "Weekly"]},
    owner: {type: mongoose.Schema.Types.ObjectId, required: [true, "Owner is required"], ref: 'Auth'}
})

export default mongoose.model('Habit', habitSchema)