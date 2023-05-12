const express = require('express')
const router = express.Router()
const { body, validationResult } = require('express-validator');
const util = require('util');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const authorized = require('../middlewares/authorize')

const db = require('../db/connection');

const query = util.promisify(db.query).bind(db); // transform query mysql --> promise to use [await/async]
checkEmailExist = async (email) => {
    // const query = util.promisify(db.query).bind(db); // transform query mysql --> promise to use [await/async]
    const checkEmail = await query(
        "SELECT name, phone, username, email, `password`, user_status, token, user_type as user_type FROM user\n" +
        "JOIN user_type\n" +
        "ON user_type_cd = user_type.id\n" +
        "JOIN user_status\n" +
        "ON user_status_cd = user_status.id\n" +
        "WHERE email = ?",
        [email]
    );

    return checkEmail;
}

checkUsernameExist = async (username) => {
    // const query = util.promisify(db.query).bind(db); // transform query mysql --> promise to use [await/async]
    const checkUsername = await query(
        "select * from user where username = ?",
        [username]
    );

    return checkUsername;
}

getUserid = async (token, res) => {
    const user = await query("select * from user where token = ?", [token]);
    if(!user[0]){
        return res.status(404).json({errors: [{message: "user not found"}]});
    }
    return user[0].id;
}


//LOGIN
router.post(
    '/login',
    body('email')
        .notEmpty()
        .withMessage("email should not be empty")
        .isEmail()
        .withMessage("please enter a valid email"),
    body('password')
        .isLength({ min: 8, max: 20 })
        .withMessage("password should be between (8-20) character"),
    async (req, res) => {
        try {
            //1. VALIDATION REQUEST
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            //2. CHECK IF EMAIL EXISTS
            const user = await checkEmailExist(req.body.email);
            if (user.length === 0) {
                return res.status(400).json({ errors: [{ message: "email not found" }] });
            }

            //3. CHECK IF PASSWORD IS CORRECT
            const checkPassword = await bcrypt.compare(req.body.password, user[0].password);

            if (checkPassword) {
                delete user[0].password;
                delete user[0].id;
                return res.status(200).json(
                    {
                        message: "Logged in successfully",
                        user: user[0]
                    });
            } else {
                return res.status(404).json({ errors: [{ message: "incorrect password" }] });
            }

        } catch (error) {
            res.statusCode = 500;
            res.send({ message: error });
        }
    }
);

//REGISTER
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
        .notEmpty()
        .withMessage('Password cannot be empty')
        .isLength({ min: 8 })
        .withMessage("password should be between (8-20) character"),
        // .matches(/^(?=.*[a-zA-Z])(?=.*\W)(?=.*\d).*$/)
        // .withMessage('Password must contain at least 1 letter and 1 symbol'),
    async (req, res) => {
        try {
            //1. VALIDATION REQUEST
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            //2. CHECK IF EMAIL EXISTS
            const checkEmail = await checkEmailExist(req.body.email);
            if (checkEmail.length > 0) {
                return res.status(400).json({ errors: [{ message: "email already exists" }] });
            }

            //3. CHECK IF USERNAME EXISTS
            const checkUsername = await checkUsernameExist(req.body.username);
            if (checkUsername.length > 0) {
                return res.status(400).json({ errors: [{ message: "username already exists" }] });
            }

            //4. PREPARE OBJECT USER TO SAVE
            const user = {
                name: req.body.name,
                email: req.body.email,
                phone: req.body.phone,
                username: req.body.username,
                // password: req.body.password,
                password: await bcrypt.hash(req.body.password, 10), //hash password
                user_type_cd: 0,
                user_status_cd: 1,
                token: crypto.randomBytes(16).toString("hex"),
            }

            //5. INSERT USER OBJECT INTO DB
            await query("insert into user set ?", user);
            delete user.password;
            // res.status(200).json(user);
            res.status(200).json(
                {
                    message: "Registered successfully",
                    user: user
                });


        } catch (error) {
            res.statusCode = 500;
            res.send({ message: error });
        }
    }
);

router.get('userData',
    authorized,
    async (req, res) => {
        await query("select * from user where token = ?", [req.headers.token]);
        res.status(200).json(user);

    }
    )
module.exports = { router, getUserid };