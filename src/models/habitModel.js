import mongoose from 'mongoose'

const habitSchema = mongoose.Schema({
    name: {type: String, required: [true, "Habit name is required"], trim: true},
    description: {type: String, trim: true, default: ""},
    frequency: {type: String, required: [true, "Habit frequency is required"], trim: true, enum: ["Daily", "Weekly"]},
    owner: {type: mongoose.Schema.Types.ObjectId, required: [true, "Habit owner is required"], ref: 'Auth'}
})

export default mongoose.model('Habit', habitSchema)