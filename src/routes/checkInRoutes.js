import express from 'express'
import requireAuth from '../middlewares/authMiddleware.js'
import {
    createCheckInForHabitByOwner,
    getAllCheckInsByOwner,
    getSingleCheckInByOwner,
    updateCheckInByOwner,
    deleteCheckInByOwner
} from '../controllers/checkInController.js'

const router = express.Router()

router.use(requireAuth)
router.post('/', createCheckInForHabitByOwner)
router.get('/', getAllCheckInsByOwner)
router.get('/:id', getSingleCheckInByOwner)
router.put('/:id', updateCheckInByOwner)
router.delete('/:id', deleteCheckInByOwner)

export default router