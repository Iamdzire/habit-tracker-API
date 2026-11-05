import mongoose from 'mongoose'

const checkInSchema = mongoose.Schema({
    habit: {type: mongoose.Schema.Types.ObjectId, required: [true, "Check-in habit is required"], ref: 'Habit'},
    owner: {type: mongoose.Schema.Types.ObjectId, required: [true, "Check-in owner is required"], ref: 'Auth'},
    date: {type: Date, required: [true, "check-in date is required."], trim: true},
    note: {type: String, trim: true, default: ""}
})

checkInSchema.index({
    habit: 1, owner: 1, date: 1
}, {unique: true})

export default mongoose.model('Check-in', checkInSchema)