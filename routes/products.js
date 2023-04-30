const express = require('express')
const router = express.Router()
const db = require('../db/connection');
const admin = require("../middlewares/admin");
const {body, validationResult} = require("express-validator");
const util = require("util");
const upload = require('../middlewares/uploadImages');
const fs = require('fs');

const query = util.promisify(db.query).bind(db); // transform query mysql --> promise to use [await/async]

categorySearch = async (categoryName, res) => {
    const category = await query("SELECT id\n" +
        "FROM category\n" +
        "WHERE LOCATE(?, category) = 1;", [categoryName]);
    if(!category[0]){
        return res.status(404).json({errors: [{message: "category not found"}]});
    } else{
        return category;
    }
}

checkProductExist = async (id, res) => {
    const product = await query("select * from product where id = ?", [id]);
    if(!product[0]){
        return res.status(404).json({errors: [{message: "product not found"}]});
    }
    return product;
}

router.post(
    '/addProduct',
    admin,
    upload.single("image"),
    body('name')
        .isString()
        .withMessage("Enter a valid product name")
        .notEmpty()
        .withMessage("Product name should not be empty"),
    body('description')
        .isString()
        .withMessage('Please enter a valid description'),
    body('price')
        .isFloat({min: 0})
        .withMessage('Please enter a positive number'),
    body('quantity')
        .isInt({min: 1})
        .withMessage('Please enter a positive integer number'),
    async (req, res) => {
        try{
            //1. VALIDATION REQUEST
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            //2. VALIDATE THE IMAGE
            if (!req.file) {
                return res.status(400).json({errors: [{msg: "Image is Required",},],});
            }

            // TODO: add category validation

            //3. CHECK IF CATEGORY EXIST
            const category = await categorySearch(req.body.category, res);
            // console.log(category[0].id);

            //4. PREPARE OBJECT PRODUCT TO SAVE
            const product = {
                name: req.body.name,
                description: req.body.description,
                price: req.body.price,
                quantity: req.body.quantity,
                // category_id: req.body.category_id,
                category_id: category[0].id,
                image: req.file.filename,
            }


            //5. INSERT PRODUCT OBJECT INTO DB
            await query(`insert into product set ?`, product);
            res.status(200).json(
                {
                    message: "Product added successfully",
                    product: product
                }
            );
        }catch (error){
            res.statusCode = 500;
            res.send({message: error});
        }
    }
)

router.put(
    '/updateProduct/:id',
    admin,
    upload.single("image"),
    body('name')
        .isString()
        .withMessage("Enter a valid product name")
        .notEmpty()
        .withMessage("Product name should not be empty"),
    body('description')
        .isString()
        .withMessage('Please enter a valid description'),
    body('price')
        .isFloat({min: 0})
        .withMessage('Please enter a positive number'),
    body('quantity')
        .isInt({min: 1})
        .withMessage('Please enter a positive integer number'),
    async (req, res) => {
        try{
            //1. VALIDATION REQUEST
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            //2. CHECK IF PRODUCT EXIST OR NOT
            const product = await checkProductExist(req.params.id, res);

            // TODO: add category validation

            //3. CHECK IF CATEGORY EXIST
            const category = await categorySearch(req.body.category, res);


            //3. PREPARE OBJECT PRODUCT TO SAVE
            const productObj = {
                name: req.body.name,
                description: req.body.description,
                price: req.body.price,
                quantity: req.body.quantity,
                // category_id: req.body.category_id,
                category_id: category[0].id,
            }

            if(req.file){
                productObj.image = req.file.filename;
                fs.unlinkSync("./upload/" + product[0].image); // delete old image
            }


            //4. UPDATE PRODUCT
            await query(`update product set ? where id = ?`, [productObj, product[0].id]);
            res.status(200).json(
                {
                    message: "Product updated successfully",
                    product: product
                }
            );
        }catch (error){
            res.statusCode = 500;
            res.send({message: error});
            console.log(error)
        }
    }
)

router.delete(
    '/deleteProduct/:id',
    admin,
    async (req, res) => {
        try{
            //1. CHECK IF PRODUCT EXIST OR NOT
            const product = await checkProductExist(req.params.id, res);

            //2. DELETE PRODUCT
            fs.unlinkSync("./upload/" + product[0].image); // delete image
            await query(`delete from product where id = ?`, [product[0].id]);
            res.status(200).json(
                {
                    message: "Product deleted successfully",
                    product: product
                }
            );
        }catch (error){
            res.statusCode = 500;
            res.send({message: error});
        }
    }
)

router.get(
    '',
    async (req, res) => {
        let search = "";
        if (req.query.search) {
            // QUERY PARAMS
            search = `where name LIKE '%${req.query.search}%'`;
        }
        const products = await query(`select * from product ${search}`);
        products.map(product => {
            product.image = "http://" + req.hostname + ":4000/" + product.image;
        })
        if(!products[0]){
            return res.status(404).json({errors: [{message: "products not found"}]});
        }
        res.status(200).json(products);
    }
)

router.get(
    '/:id',
    async (req, res) => {
        const product = await checkProductExist(req.params.id, res);
        res.status(200).json(product[0]);
    }
)

module.exports = router;