const db = require("../db/connection");
const util = require('util');

const admin = async (req, res, next) => {
    const query = util.promisify(db.query).bind(db); // transform query mysql --> promise to use [await/async]
    const {token} = req.headers;
    const admin = await query("select * from user where token = ?", [token]);
    if(admin[0] && admin[0].user_type_cd === 1){
        next();
    } else {
        res.statusCode = 403;
        res.send({
            message: "You are not authorized to access this page",
        });
    }
}

module.exports = admin;