import express from 'express'
import {requireAuth} from '../middlewares/authMiddleware.js'
import {createHabitRules} from '../middlewares/habitValidation.js'
import {validate} from '../middlewares/validate.js'
import {
    createHabit,
    getAllHabitsByOwner,
    getSingleHabitByOwner,
    updateHabitByOwner,
    deleteHabitByOwner,
} from '../controllers/habitController.js'
import {getCheckInsForHabitByOwner} from '../controllers/checkInController.js'

const router = express.Router()

router.use(requireAuth)
router.post('/', createHabitRules, validate, createHabit)
router.get('/', getAllHabitsByOwner)
router.get('/:id', getSingleHabitByOwner)
router.put('/:id', updateHabitByOwner)
router.delete('/:id', deleteHabitByOwner)

// Nested Routes
router.get('/:id/check-ins', getCheckInsForHabitByOwner)

export default router