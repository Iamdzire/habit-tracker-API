import express from 'express'
import {createUser, loginUser, getAllUsers, getSingleUser, updateUser, deleteUser} from '../controllers/authController.js'
import {requireAuth, requireRole} from '../middlewares/authMiddleware.js'
import {createUserRules, loginUserRules} from '../middlewares/authValidation.js'
import {validate} from '../middlewares/validate.js'


const router = express.Router()

router.post('/create',createUserRules, validate, createUser)
router.post('/login',loginUserRules, validate, loginUser)
router.get('/', requireAuth, requireRole('admin'), getAllUsers)
router.get('/:id', requireAuth, requireRole('user', 'admin'), getSingleUser)
router.put('/:id', requireAuth, requireRole('user', 'admin'), updateUser)
router.delete('/:id', requireAuth, requireRole('user', 'admin'), deleteUser)

export default router