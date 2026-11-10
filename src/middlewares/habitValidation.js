import {body} from 'express-validator'

export const createHabitRules = [
    body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required'),

    body('frequency')
    .notEmpty()
    .withMessage('Frequency is required')
    .isIn(['Daily', 'Weekly'])
    .withMessage('Frequency mube be Daily or Weekly.'),

    body('description')
    .optional()
    .trim()
]