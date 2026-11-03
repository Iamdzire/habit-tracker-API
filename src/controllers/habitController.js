import habitModel from '../models/habitModel.js'

export const createHabit = async (req, res) => {
    try {
        const { name, description, frequency } = req.body
        if (!name || !frequency) {
            return res.status(400).json({
                error: "All required fields need to be filled."
            })
        }
        const newHabit = new habitModel({
            name,
            description,
            frequency,
            owner: req.user._id
        })
        await newHabit.save()

        return res.status(201).json({
            message: "Habit created successfully.",
            data: newHabit
        })
    } catch (error) {
        return res.status(500).json({
            error: error.message
        })
    }
}


export const getAllHabitsByOwner = async (req, res) => {
    try {
        const {page, limit, name, description, sort} = req.query
        const pageNumber = Number(page) || 1
        const limitNumber = Number(limit) || 4
        const skip = (pageNumber - 1) * limitNumber

        const filter = {owner: req.user._id}
        if(name){
            filter.name = {$regex: name, $options: 'i'}
        }
        if(description){
            filter.description = {$regex: description, $options: 'i'}
        }

        const sortOption = {name: 1} // Default: Sort by name
        if(sort === 'description'){
            sortOption = {description: 1}
        }

        const habits = await habitModel
        .find(filter)
        .sort(sortOption)
        .skip(skip)
        .limit(limitNumber)
        
        if(habits.length === 0){
            return res.status(404).json({
                error: "No book found."
            })
        }
        const total = await habitModel.countDocuments(filter)
        const totalPages = Math.ceil(total / limitNumber)

        return res.status(200).json({
            message: "All habits fetched successfully.",
            data: {
                habits,
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


export const getSingleHabitByOwner = async (req, res) => {
    try {
        const {id} = req.params
        const habit = await habitModel.findById(id)
        if(!habit){
            return res.status(404).json({
                error: "Habit not found."
            })
        }
        if(req.user._id.toString() !== habit.owner.toString()){
            return res.status(403).json({
                error: "user not authorized."
            })
        }
        return res.status(200).json({
            message: "Habit fetched successfully.",
            data: habit
        })
    }catch(error){
        return res.status(500).json({
            error: error.message
        })
    }
}


export const updateHabitByOwner = async (req, res) => {
    try {
        const {id} = req.params
        const {name, description, frequency} = req.body
        const habit = await habitModel.findById(id)
        if(!habit){
            return res.status(404).json({
                error: "Habit not found."
            })
        }
        if(req.user._id.toString() !== habit.owner.toString()){
            return res.status(403).json({
                error: "User not authorized."
            })
        }
        let putName = habit.name
        let putDescription = habit.description
        let putFrequency = habit.frequency
        
        if(name){
            putName = name
        }
        if(description){
            putDescription = description
        }
        if(frequency){
            putFrequency = frequency
        }
        habit.name = putName
        habit.description = putDescription
        habit.frequency = putFrequency

        await habit.save()

        return res.status(200).json({
            message: "Habit updated successfully.",
            data: habit
        })
    }catch(error){
        return res.status(500).json({
            error: error.message
        })
    }
}


export const deleteHabitByOwner = async (req, res) => {
    try {
        const {id} = req.params
        const habit = await habitModel.findById(id)
        if(!habit){
            return res.status(404).json({
                error: "Habit not found.",
            })
        }
        if(req.user._id.toString() !== habit.owner.toString()){
            return res.status(403).json({
                error: "User not authorized."
            })
        }
        await habitModel.findByIdAndDelete(id)

        return res.status(200).json({
            message: "habit deleted successfully.",
            data: habit
        })
    }catch(error){
        return res.status(500).json({
            error: error.message
        })
    }
}