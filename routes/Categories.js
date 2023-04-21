const express = require('express')
const router = express.Router()
const db = require('../db/connection');

router.post('/add-category', (req, res) => {
    res.status(200).json({
        message: "Category added successfully",
    });
});

module.exports = router;