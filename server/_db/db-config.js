const path = require("path");

module.exports = {
    development: {
        client: "sqlite3",
        connection: {
            filename: path.join(__dirname, "demogossipy.sqlite3"),
        },
        useNullAsDefault: true,
    },
};
