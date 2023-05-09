const express = require('express')
const router = express.Router()
const db = require('../db/connection');
const admin = require("../middlewares/admin");
const {body, validationResult} = require("express-validator");
const util = require("util");
const bcrypt = require("bcrypt");

const query = util.promisify(db.query).bind(db); // transform query mysql --> promise to use [await/async]

router.get('/userData',
    async (req, res) => {
        const user = await query("SELECT user.name, user.phone, user.username, user_status.user_status, user_type.user_type\n" +
            "FROM user\n" +
            "JOIN user_status\n" +
            "ON user_status.id = user_status_cd\n" +
            "JOIN user_type\n" +
            "ON user_type.id = user_type_cd\n" +
            "WHERE user.token = ?", [req.headers.token]);
        res.status(200).json(user);

    }
)

router.put('/updateUser',
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
        .isLength({ min: 8 })
        .withMessage("password should be between (8-20) character"),
        // .matches(/^(?=.*[a-zA-Z])(?=.*\W)(?=.*\d).*$/)
        // .withMessage('Password must contain at least 1 letter and 1 symbol'),
    async (req, res) => {
        try {
            //1. VALIDATION REQUEST
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({errors: errors.array()});
            }

            const oldUser = await query("select * from user where token = ?", [req.headers.token]);

            //2. CHECK EMAIL EXIST
            if(req.body.email !== oldUser[0].email) {
                const checkEmail = await query("select * from user where email = ?", [req.body.email]);
                if (checkEmail[0]) {
                    return res.status(400).json({errors: [{message: "email already exist"}]});
                }
            }

            //3. CHECK USERNAME EXIST
            if(req.body.username !== oldUser[0].username) {
                const checkUsername = await query("select * from user where username = ?", [req.body.username]);
                if (checkUsername[0]) {
                    return res.status(400).json({errors: [{message: "username already exist"}]});
                }
            }

            //4. UPDATE USER
            if(req.body.password) {
                const password = await bcrypt.hash(req.body.password, 10);
                await query("update user set name = ?, email = ?, username = ?, password = ?, phone= ? where token = ?",
                    [req.body.name, req.body.email, req.body.username, password, req.body.phone, req.headers.token]);
            } else {
                await query("update user set name = ?, email = ?, username = ?, phone= ? where token = ?",
                    [req.body.name, req.body.email, req.body.username, req.body.phone, req.headers.token]);
            }
            //5. GET UPDATED USER
            const user = await query("select name, email, username, phone from user where token = ?", [req.headers.token]);

            //6. RESPONSE
            res.status(200).json(
                {
                    message: "user updated successfully",
                    userUpdated: user[0]
                }
            );
        } catch (error) {
            res.status(500).json({errors: [{message: error.message}]});
        }

    }
)

router.get('/getAllUsers',
    admin,
    async (req, res) => {
        const users = await query("SELECT user.id, user.name, user.phone, user.username, user_status.user_status, user_type.user_type\n" +
            "FROM user\n" +
            "JOIN user_status\n" +
            "ON user_status.id = user_status_cd\n" +
            "JOIN user_type\n" +
            "ON user_type.id = user_type_cd");
        res.status(200).json(users);

    }
)

router.delete('/deleteUser/:id',
    admin,
    async (req, res) => {
        try {
            const user = await query("select * from user where id = ?", [req.params.id]);
            if(!user[0]) {
                return res.status(400).json({errors: [{message: "user not found"}]});
            }
            if(user[0].user_type_cd === 1) {
                return res.status(400).json({errors: [{message: "you can't delete admin"}]});
            }
            await query("delete from user where id = ?", [req.params.id]);
            res.status(200).json({message: "user deleted successfully"});
        } catch (error) {
            res.status(500).json({errors: [{message: error.message}]});
        }
    }
)

module.exports = router;