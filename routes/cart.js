const express = require('express')
const router = express.Router()
const db = require('../db/connection');
const admin = require("../middlewares/admin");
const {check, body, validationResult, checkSchema} = require("express-validator");
const util = require("util");

const query = util.promisify(db.query).bind(db); // transform query mysql --> promise to use [await/async]

checkProductExist = async (id, res) => {
    const product = await query("select * from product where id = ? AND quantity > 0", [id]);
    if(!product[0]){
        return res.status(404).json({errors: [{message: "product not found or out of stock"}]});

    }
    return product;
}

checkProductInCart = async (product_id, user_id, res) => {
    const product = await query("select * from cart where product_id = ? AND user_id = ?", [product_id, user_id]);
    if(product[0]){
        // return res.status(400).json({errors: [{message: "product already in cart"}]});
        return true;
    }
    return false;
}

getUserid = async (token, res) => {
    const user = await query("select * from user where token = ?", [token]);
    if(!user[0]){
        return res.status(404).json({errors: [{message: "user not found"}]});
    }
    return user[0].id;
}

router.post('/product/addToCart/:id',
    async (req, res) => {
        try{
            //1. CHECK IF PRODUCT EXIST
            await checkProductExist(req.params.id, res);
            const userId = await getUserid(req.headers.token, res);

            //2. CHECK IF PRODUCT ALREADY IN CART
            if(await checkProductInCart(req.params.id, userId, res)){
                return res.status(400).json({errors: [{message: "product already in cart"}]});
            }

            //3. PREPARE OBJECT CATEGORY TO SAVE
            const product = {
                product_id: req.params.id,
                user_id: res.locals.user.id,
                product_quantity: 1,
            }

            //4. INSERT CART OBJECT INTO DB
            await query("insert into cart set ?", product);
            res.status(200).json(
                {
                    message: "Product added to cart successfully",
                    Product: product
                }
            );
        } catch (error){
            res.statusCode = 500;
            res.send({message: error});
        }
    }
)

router.delete('/product/deleteFromCart/:id',
    async (req, res) => {
        try{
            //1. CHECK IF PRODUCT EXIST
            const product = await query("select * from product where id = ?", [req.params.id]);
            if(!product[0]){
                return res.status(404).json({errors: [{message: "product not found"}]});
            }
            const userId = await getUserid(req.headers.token, res);

            //2. CHECK IF PRODUCT NOT IN CART
            if(!await checkProductInCart(req.params.id, userId, res)){
                return res.status(400).json({errors: [{message: "product not in cart"}]});
            }

            //3. DELETE PRODUCT FROM CART
            await query("delete from cart where product_id = ? AND user_id = ?", [req.params.id, userId]);
            res.status(200).json(
                {
                    message: "Product deleted from cart successfully",
                }
            );
        } catch (error){
            res.statusCode = 500;
            res.send({message: error});
        }
    }
)

router.put('/product/updateQuantity/:id',
    body("quantity")
        .isInt({min: 1})
        .withMessage("quantity must be more than 1"),

    async (req, res) => {
        try{
            //1. VALIDATION REQUEST
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            const quantity = await query("select quantity from product where id = ?", [req.params.id]);
            if(quantity[0].quantity < req.body.quantity){
                return res.status(400).json({errors: [{message: "quantity must be less than or equal to product quantity"}]});
            }

            //1. CHECK IF PRODUCT EXIST
            const product = await query("select * from product where id = ?", [req.params.id]);
            if(!product[0]){
                return res.status(404).json({errors: [{message: "product not found"}]});
            }
            const userId = await getUserid(req.headers.token, res);

            //2. CHECK IF PRODUCT NOT IN CART
            if(!await checkProductInCart(req.params.id, userId, res)){
                return res.status(400).json({errors: [{message: "product not in cart"}]});
            }

            //3. UPDATE PRODUCT QUANTITY IN CART
            await query("update cart set product_quantity = ? where product_id = ? AND user_id = ?", [req.body.quantity, req.params.id, userId]);
            res.status(200).json(
                {
                    message: "Product quantity updated successfully",
                }
            );
        } catch (error){
            res.statusCode = 500;
            res.send({message: error});
        }
    }
)
module.exports = router;