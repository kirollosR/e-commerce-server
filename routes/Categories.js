const express = require('express')
const router = express.Router()
const db = require('../db/connection');
const admin = require("../middlewares/admin");
const {body, validationResult} = require("express-validator");
const util = require("util");

const query = util.promisify(db.query).bind(db); // transform query mysql --> promise to use [await/async]

checkCategoryExist = async (id, res) => {
    const category = await query("select * from category where id = ?", [id]);
    if(!category[0]){
        return res.status(404).json({errors: [{message: "category not found"}]});
    }
    return category;
}
router.post(
    '/add-category',
    admin,
    body('category')
        .isString()
        .withMessage('please enter a valid category name')
        .notEmpty()
        .withMessage('category should not be empty'),
    body('description')
        .isString()
        .withMessage('please enter a valid description'),
    async (req, res) => {
        try{
            //1. VALIDATION REQUEST
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            //2. PREPARE OBJECT CATEGORY TO SAVE
            const category = {
                category: req.body.category,
                description: req.body.description,
            }

            //3. INSERT CATEGORY OBJECT INTO DB
            await query("insert into category set ?", category);
            res.status(200).json(
                {
                    message: "Category added successfully",
                    category: category
                }
            );
        }catch (error){
            res.statusCode = 500;
            res.send({message: error});
        }
    }
);

router.put(
    '/update-category/:id',
    admin,
    body('category')
        .isString()
        .withMessage('please enter a valid category name')
        .notEmpty()
        .withMessage('category should not be empty'),
    body('description')
        .isString()
        .withMessage('please enter a valid description'),
    async (req, res) => {
        try{
            //1. VALIDATION REQUEST
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            //2. CHECK IF CATEGORY EXISTS OR NOT
            const category = await checkCategoryExist(req.params.id, res);

            //3. PREPARE OBJECT CATEGORY TO SAVE
            const categoryObj = {
                category: req.body.category,
                description: req.body.description,
            }

            //3. UPDATE CATEGORY OBJECT INTO DB
            await query("update category set ? where id = ?", [categoryObj, category[0].id]);
            res.status(200).json(
                {
                    message: "Category updated successfully",
                    category: categoryObj
                }
            );
        }catch (error){
            res.statusCode = 500;
            res.send({message: error});
        }
    }
);

router.delete(
    '/delete-category/:id',
    admin,
    async (req, res) => {
        try{
            //1. CHECK IF CATEGORY EXISTS OR NOT
            const category = await checkCategoryExist(req.params.id, res);

            //2. DELETE CATEGORY OBJECT INTO DB
            await query("delete from category where id = ?", [category[0].id]);
            res.status(200).json(
                {
                    message: "Category deleted successfully",
                }
            );
        }catch (error){
            res.statusCode = 500;
            res.send({message: error});
        }
    }
);

router.get('',
    async (req, res) => {
        const categories = await query("select * from category");
        if(!categories[0]){
            return res.status(404).json({errors: [{message: "Empty categories"}]});
        }
        res.status(200).json(categories);

    }
)

router.get('/get-category/:id',
    async (req, res) => {
        const category = await checkCategoryExist(req.params.id, res);
        res.status(200).json(category);

    }
)

module.exports = router;