const express = require("express");
const app = express();
const port = process.env.PORT || 3000;

const cors = require("cors");
const helmet = require("helmet");
const path = require("path");
const swaggerUi = require("swagger-ui-express");
const swaggerFile = require("./swagger-output.json");
const corsOptions = {
    /*  origin: (origin, callback) => {
        console.log(origin);
        if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    }, */
};

app.use(cors(corsOptions));
app.use(
    helmet({
        crossOriginResourcePolicy: false,
    })
);
app.use(
    express.urlencoded({
        extended: false,
    })
);

app.use(express.json());

const createTable = require("./_db/schemas");
createTable.createTables();

const rateLimit = require("express-rate-limit");
const loginLimiter = rateLimit({
    windowMs: 4 * 60 * 1000,
    limit: 7,
    message: "Too many login requests from this IP, please try again after 4 minutes",
});

const authRoutes = require("./api/auth.routes");
app.use("/auth", loginLimiter, authRoutes);
const communityRoutes = require("./api/community.routes");
const contentRoutes = require("./api/content.routes");
app.use("/community", communityRoutes, contentRoutes);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerFile));

app.use(express.static("view"));

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "view", "index.html"));
});

app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "view", "index.html"));
});

app.listen(port, () => {
    console.log(`Listening on port http://localhost:${port}`);
});
