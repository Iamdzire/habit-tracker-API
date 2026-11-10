import {body} from 'express-validator'

export const createUserRules = [
    body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required.'),

    body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required.')
    .isEmail()
    .withMessage('Please provide a valid email.'),

    body('password')
    .notEmpty()
    .withMessage('Password is required.')
    .isLength({min: 6})
    .withMessage('Password must be at least 6 characters in length.'),

    body('confirmPassword')
    .notEmpty()
    .withMessage('Confirm password is required')
    .custom((value, {req}) => {
        if(value !== req.body.password){
            throw new Error('Passwords do not match')
        }
        return true
    })
]


export const loginUserRules = [
    body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required.')
    .isEmail()
    .withMessage('Please provide a valid email.'),

    body('password')
    .notEmpty()
    .withMessage('Password is required.')
]


export const updateUserRules = [
    body('name')
    .optional()
    .trim(),

    body('email')
    .optional()
    .trim()
    .isEmail()
    .withMessage('Please provide a valid email.'),

    body('password')
    .optional()
    .isLength({min: 6})
    .withMessage('Password must be at least 6 characters in length.'),

    body('confirmPassword')
    .optional()
    .custom((value, {req}) => {
        if(value !== req.body.password){
            throw new Error('Passwords do not match.')
        }
        return true
    })
]