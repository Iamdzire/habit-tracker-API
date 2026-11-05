import checkInModel from '../models/checkInModel.js'
import habitModel from '../models/habitModel.js'

export const createCheckInByOwner = async (req, res) => {
    try {
        const {habit, date, note} = req.body
        if(!habit || !date){
            return res.status(400).json({
                error: "All required fields must be filled."
            })
        }
        const putHabit = await habitModel.findById(habit)
        if(!putHabit){
            return res.status(404).json({
                error: "Habit not found."
            })
        }
        if(req.user._id.toString() !== putHabit.owner.toString()){
            return res.status(403).json({
                error: "User not authorized."
            })
        }

        const newCheckIn = new checkInModel({
            habit,
            owner: req.user._id,
            date,
            note
        })
        await newCheckIn.save()

        return res.status(201).json({
            message: "Check-in created successfully.",
            data: newCheckIn
        })
    }catch(error){
        return res.status(500).json({
            error: error.message
        })
    }
}


export const getAllCheckInsByOwner = async (req, res) => {
    try {
        const {page, limit, note, sort} = req.query
        const pageNumber = Number(page) || 1
        const limitNumber = Number(limit) || 4
        const skip = (pageNumber - 1) * limitNumber

        const filter = {owner: req.user._id}
        if(note){
            filter.note = {$regex: note, $options: 'i'}
        }

        let sortOption = {date: -1} // Default: Sort by newest to oldest
        if(sort === 'note'){
            sortOption = {note: 1}
        }

        const checkIns = await checkInModel
        .find(filter)
        .sort(sortOption)
        .skip(skip)
        .limit(limitNumber)
        .populate('habit')

        if(checkIns.length === 0){
            return res.status(404).json({
                error: "No check-in found."
            })
        }
        const total = await checkInModel.countDocuments(filter)
        const totalPages = Math.ceil(total / limitNumber)

        return res.status(200).json({
            message: "All check-ins fetched successfully.",
            data: {
                checkIns,
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


export const getSingleCheckInByOwner = async (req, res) => {
    try {
        const {id} = req.params
        const checkIn = await checkInModel.findById(id).populate('habit')
        if(!checkIn){
            return res.status(404).json({
                error: "Check-in not found."
            })
        }
        if(req.user._id.toString() !== checkIn.owner.toString()){
            return res.status(403).json({
                error: "User not authorized."
            })
        }
        return res.status(200).json({
            message: "Check-in fetched successfully.",
            data: checkIn
        })
    }catch(error){
        return res.status(500).json({
            error: error.message
        })
    }
}


export const updateCheckInByOwner = async (req, res) => {
    try {
        const {habit, date, note} = req.body
        const {id} = req.params
        const checkIn = await checkInModel.findById(id)
        if(!checkIn){
            return res.status(404).json({
                error: "Check-in not found."
            })
        }
        if(req.user._id.toString() !== checkIn.owner.toString()){
            return res.status(403).json({
                error: "User not authorized."
            })
        }

        let putHabit = checkIn.habit
        let putDate = checkIn.date
        let putNote = checkIn.note

        if(habit){
            const validateHabit = await habitModel.findById(habit)
            if(!validateHabit){
                return res.status(404).json({
                    error: "Habit not found."
                })
            }
            if(req.user._id.toString() !== validateHabit.owner.toString()){
                return res.status(403).json({
                    error: "User not authorized."
                })
            }
            putHabit = validateHabit._id
        }
        if(date){
            putDate = date
        }
        if(note){
            putNote = note
        }

        checkIn.habit = putHabit
        checkIn.date = putDate
        checkIn.note = putNote
        await checkIn.save()

        return res.status(200).json({
            mesage: "Check-in updated successfully.",
            data: checkIn
        })
    }catch(error){
        return res.status(500).json({
            error: error.message
        })
    }
}


export const deleteCheckInByOwner = async (req, res) => {
    try {
        const {id} = req.params
        const checkIn = await checkInModel.findById(id)
        if(!checkIn){
            return res.status(404).json({
                error: "Check-in not found."
            })
        }
        if(req.user._id.toString() !== checkIn.owner.toString()){
            return res.status(403).json({
                error: "User not authorized."
            })
        }
        await checkInModel.findByIdAndDelete(id)

        return res.status(200).json({
            message: "Check-in deleted successfully.",
            data: checkIn
        })
    }catch(error){
        return res.status(500).json({
            error: error.message
        })
    }
}