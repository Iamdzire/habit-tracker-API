import mongoose from 'mongoose'

const checkInSchema = mongoose.Schema({
    habit: {type: mongoose.Schema.Types.ObjectId, required: [true, "Habit is required"], ref: 'Habit'},
    owner: {type: mongoose.Schema.Types.ObjectId, required: [true, "Owner is required"], ref: 'Auth'},
    date: {type: Date, required: [true, "Date is required."], trim: true},
    note: {type: String, trim: true}
})

checkInSchema.index({
    habit: 1, owner: 1, date: 1
}, {unique: true})

export default mongoose.model('Check-in', checkInSchema)