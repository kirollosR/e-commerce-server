const express = require('express')
const router = express.Router()
const db = require('../db/connection');
const admin = require("../middlewares/admin");
const {body, validationResult} = require("express-validator");
const util = require("util");

const { isCartEmpty, getCart, emptyCart } = require('./cart');
const { getUserid } = require('./auth');


const query = util.promisify(db.query).bind(db); // transform query mysql --> promise to use [await/async]
router.post('/addOrder',
    async (req, res) => {
        try {
            const userId = await getUserid(req.headers.token, res);

            //1. CHECK IF CART IS EMPTY
            if (await isCartEmpty(userId)) {
                return res.status(400).json({errors: [{message: "cart is empty"}]});
            }

            //2. GET CART
            const cart = await getCart(userId, req);
            if(!cart){
                return res.status(400).json({errors: [{message: "cart is empty"}]});
            }

            //3. PREPARE ORDER OBJECT ORDER TO SAVE
            const orderObj = {
                user_id: userId,
                order_status_cd: 3,
            }

            //4. SAVE ORDER
            const result = await query("INSERT INTO `order` SET ?", [orderObj]);
            const orderId = result.insertId;

            //5. SAVE ORDER DETAILS
            await query("INSERT INTO product_order (order_id, product_id, quantity)\n" +
                "SELECT ?, product_id, product_quantity\n" +
                "FROM cart\n" +
                "WHERE user_id = ?", [orderId, userId])

            //6. DELETE FROM CART
            await emptyCart(userId);

            res.status(200).json({message: "order created successfully"});


        } catch (err) {
            console.error(err.message);
            res.status(500).send("Server error");
        }
    }
)

router.delete('/deleteOrder/:id',
    async (req, res) => {
        try {
            //1. CHECK IF ORDER EXIST for this user
            const userId = await getUserid(req.headers.token, res);
            const order = await query("select * from `order` where id = ? AND user_id = ?", [req.params.id, userId]);
            if (!order[0]) {
                return res.status(404).json({errors: [{message: "order not found"}]});
            }

            //2. DELETE ORDER
            await query("DELETE FROM `order` WHERE id = ?", req.params.id);
            res.status(200).json(
                {
                    message: "Order deleted successfully",
                }
            );
        } catch (err) {
            console.error(err.message);
            res.status(500).send("Server error");
        }
    }
)

router.get('/getOrders',
    async (req, res) => {
        try {
            const userId = await getUserid(req.headers.token, res);
            const orders = await query("SELECT `order`.id, order_status.status, product.name, product.image, product.price, product_order.quantity FROM `order` \n" +
                "JOIN order_status\n" +
                "ON `order`.`order_status_cd` = order_status.id\n" +
                "JOIN product_order\n" +
                "ON product_order.order_id = `order`.id\n" +
                "JOIN product\n" +
                "ON product.id = product_order.product_id\n" +
                "WHERE user_id = ?", [userId]);
            orders.map(product => {
                product.image = "http://" + req.hostname + ":4000/" + product.image;
            })

            let result = {};
            orders.forEach(order => {
                const { id, status, name, image, price, quantity } = order;
                if (!result[id]) {
                    result[id] = { orderId: id,orderStatus:status, items: [] };
                }
                result[id].items.push({ name, image, price, quantity });
            });

            res.status(200).json({
                orders: Object.values(result)
            });

            // res.status(200).json({
            //     orders: orders
            // });
        } catch (err) {
            console.error(err.message);
            res.status(500).send("Server error");
        }
    }
)

router.get('/getAllOrders',
    admin,
    async (req, res) => {
        try{
            const userId = await getUserid(req.headers.token, res);
            const orders = await query("SELECT `order`.id, order_status.status, user.name as user_name, user.username, user.phone, user.email, product.name, product.price, product_order.quantity FROM `order`\n" +
                "JOIN user\n" +
                "ON `order`.`user_id` = user.id\n" +
                "JOIN order_status\n" +
                "ON `order`.`order_status_cd` = order_status.id\n" +
                "JOIN product_order\n" +
                "ON product_order.order_id = `order`.id\n" +
                "JOIN product\n" +
                "ON product.id = product_order.product_id");

            let result = {};
            orders.forEach(order => {
                const { id, status, name, price, quantity, user_name, username, phone, email } = order;
                if (!result[id]) {
                    result[id] = { orderId: id, orderStatus: status, name: user_name, username: username, phone: phone, email:email, items: [] };
                }
                result[id].items.push({ name, price, quantity });
            });

            res.status(200).json({
                orders: Object.values(result)
            });

            // res.status(200).json({
            //     orders: orders
            // });
        } catch (err) {
            console.error(err.message);
            res.status(500).send("Server error");
        }
    }
)

router.put('/acceptOrder/:id',
    admin,
    async (req, res) => {
        try {
            const order = await query("select * from `order` where id = ?", [req.params.id]);
            if (!order[0]) {
                return res.status(404).json({errors: [{message: "order not found"}]});
            }

            await query("UPDATE `order` SET order_status_cd = 1 WHERE id = ?", req.params.id);
            res.status(200).json(
                {
                    message: "Order accepted successfully",
                }
            );
        } catch (err) {
            console.error(err.message);
            res.status(500).send("Server error");
        }
    }
)

router.put('/declineOrder/:id',
    admin,
    async (req, res) => {
        try {
            const order = await query("select * from `order` where id = ?", [req.params.id]);
            if (!order[0]) {
                return res.status(404).json({errors: [{message: "order not found"}]});
            }

            await query("UPDATE `order` SET order_status_cd = 2 WHERE id = ?", req.params.id);
            res.status(200).json(
                {
                    message: "Order declined successfully",
                }
            );
        } catch (err) {
            console.error(err.message);
            res.status(500).send("Server error");
        }
    }
)

module.exports = router;