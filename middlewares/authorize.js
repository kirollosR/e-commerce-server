const db = require("../db/connection");
const util = require('util');

const authorized = async (req, res, next) => {
    const query = util.promisify(db.query).bind(db); // transform query mysql --> promise to use [await/async]
    const {token} = req.headers;
    const user = await query("select * from user where token = ?", [token]);
    if(user[0]){
        res.locals.user = user[0];
        next();
    } else {
        res.statusCode = 403;
        res.send({
            message: "You are not authorized to access this page",
        });
    }
}

module.exports = authorized;