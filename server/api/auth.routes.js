const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
require("dotenv").config();

const dbConfig = require("../_db/db-config");
const db = require("knex")(dbConfig.development);
const jwt = require("jsonwebtoken");
const {CreateCommunities} = require("../_db/dummy.datas");
router.post("/register", async (req, res) => {
    try {
        const {username, email, password, latitude, longitude, is_agreed} = req.body;

        if (!username || !email || !password || !latitude || !longitude || !is_agreed) {
            return res.status(400).send({
                message: "Invalid input.",
                status: 400,
            });
        }

        if (password.length < 6 || password.length > 20) {
            return res.status(400).send({
                message: "Password must be between 6 and 20 characters.",
                status: 400,
            });
        }

        if (username.length < 6 || username.length > 20) {
            return res.status(400).send({
                message: "Username must be between 6 and 20 characters.",
                status: 400,
            });
        }

        const user = await db("users").where({email: email}).first();
        if (user) {
            return res.status(400).send({
                message: "You cannot register with this email.",
                status: -1,
            });
        }

        if (user && (user.email === email || user.username === username)) {
            return res.status(400).send({
                message: "You cannot register with this email or username.",
                status: -1,
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = {
            username,
            email,
            password: hashedPassword,
            latitude,
            longitude,
            is_active: true,
            last_login_date: new Date(),
            created_date: new Date(),
            modified_date: new Date(),
        };
        await db("users").insert(newUser);

        return res.status(200).send({
            message: "Registered.",
            status: 200,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            message: "Internal server error.",
            status: 500,
        });
    }
});

router.post("/login", async (req, res) => {
    try {
        const {username, password} = req.body;
        if (!username || !password) {
            return res.status(400).send({
                message: "Invalid input.",
                status: 400,
            });
        }
        const user = await db("users").where({username: username}).first();
        if (!user) {
            return res.status(400).send({
                message: "Invalid.",
                status: 400,
            });
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).send({
                message: "Invalid password.",
                status: 400,
            });
        }

        const tokenCredentials = {
            id: user.id,
            lat: user.latitude,
            long: user.longitude,
            ipAddress: req.headers["x-forwarded-for"] || req.socket.remoteAddress || null,
        };
        const token = jwt.sign(tokenCredentials, process.env.SECRET_KEY, {
            expiresIn: "4h",
        });

        await CreateCommunities(user.latitude, user.longitude);

        return res.status(200).send({
            message: "Success.",
            status: 200,
            data: {
                token: token,
            },
        });
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            message: "Internal server error.",
            status: 500,
        });
    }
});

module.exports = router;
