const express = require('express')
const router = express.Router()
const db = require('../db/connection');
const {body, validationResult} = require("express-validator");
const util = require("util");

const { getUserid } = require('./auth');


const query = util.promisify(db.query).bind(db); // transform query mysql --> promise to use [await/async]

checkProductExist = async (id, res) => {
    const product = await query("select * from product where id = ? AND quantity > 0", [id]);
    if(!product[0]){
        // return res.status(404).json({errors: [{message: "product not found or out of stock"}]});
        return false;
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

isCartEmpty = async (user_id) => {
    const cart = await query("select * from cart where user_id = ?", [user_id]);
    if(!cart[0]){
        return true;
    }
    return false;
}

getCart = async (userId, req) => {
    const cart = await query("SELECT * FROM cart\n" +
        "WHERE cart.user_id = ?", [userId]);
    return cart;
}

emptyCart = async (userId) => {
    await query("DELETE FROM `cart` WHERE user_id = ?", userId)
}

router.post('/product/addToCart/:id',
    async (req, res) => {
        try{
            //1. CHECK IF PRODUCT EXIST
            if(!await checkProductExist(req.params.id, res)){
                return res.status(404).json({errors: [{message: "product not found or out of stock"}]});
            }
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

router.get('/getCart',
    async (req, res) => {
        try{
            const userId = await getUserid(req.headers.token, res);
            const cart = await query("SELECT product.name, cart.product_quantity, product.image FROM cart\n" +
                "JOIN product ON product.id  = cart.product_id\n" +
                "WHERE cart.user_id = ?", [userId]);
            cart.map(product => {
                product.image = "http://" + req.hostname + ":4000/" + product.image;
            })
            if(!cart[0]){
                return res.status(404).json({errors: [{message: "cart is empty"}]});
            }
            res.status(200).json(
                {
                    message: "Cart",
                    cart: cart
                }
            );
        } catch (error){
            res.statusCode = 500;
            res.send({message: error});
        }
    }
)
module.exports = { router, isCartEmpty, getCart, emptyCart };