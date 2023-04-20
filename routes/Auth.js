const express = require('express')
const router = express.Router()
const {body, validationResult} = require('express-validator');

const db = require('../db/connection');

router.post(
    '/register',
    body('email')
        .notEmpty()
        .withMessage("email should not be empty")
        .isEmail()
        .withMessage("please enter a valid email"),
    body('name')
        .isString()
        .withMessage("please enter a valid name")
        .notEmpty()
        .withMessage("name should not be empty"),
    body('password')
        .isLength({min: 8, max: 20})
        .withMessage("password should be between (8-20) character"),
    (req, res) => {
    try {
        //1. VALIDATION REQUEST
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        res.json("success");

    } catch (error) {
        res.statusCode = 500;
        res.send({message: error});
    }
});
module.exports = router;