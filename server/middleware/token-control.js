const jwt = require("jsonwebtoken");
require("dotenv").config();
const knex = require("knex");
const dbConfig = require("../_db/db-config");
const db = knex(dbConfig.development);

module.exports = async (req, res, next) => {
    try {
        const token = req.headers.authorization;
        const withoutBearer = token.replace("Bearer ", "");
        var decodedToken = jwt.verify(withoutBearer, process.env.SECRET_KEY);
        if (decodedToken) {
            const user = await db("users").where({Id: decodedToken.id}).first();
            req.latitude = user.latitude;
            req.longitude = user.longitude;
            req.email = user.email;
            req.userId = user.id;
            next();
        }
    } catch (error) {
        if (error.name === "TokenExpiredError") {
            return res.status(401).send({
                message: "Session timeout.",
                status: -2,
            });
        } else if (error.name === "JsonWebTokenError") {
            return res.status(401).send({
                message: "Invalid token.",
                status: -1,
            });
        } else {
            return res.status(401).send({
                message: "Invalid input.",
                status: -1,
            });
        }
    }
};
