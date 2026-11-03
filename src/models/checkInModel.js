import mongoose from 'mongoose'

const checkInSchema = mongoose.Schema({
    habit: {type: mongoose.Schema.Types.ObjectId, required: [true, "Check-in habit is required"], ref: 'Habit'},
    owner: {type: mongoose.Schema.Types.ObjectId, required: [true, "Check-in owner is required"], ref: 'Auth'},
    date: {type: Date, trim: true},
    note: {type: String, trim: true, default: ""}
})

export default mongoose.model('Check-in', checkInSchema)