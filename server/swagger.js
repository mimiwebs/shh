const swaggerAutogen = require("swagger-autogen")();

const doc = {
    info: {
        title: "API Documentation",
        description: "API documentation with Swagger",
    },
    host: "localhost:3000",
    schemes: ["http"],
};

const outputFile = "./swagger-output.json";
const endpointsFiles = ["./app.js"];

swaggerAutogen(outputFile, endpointsFiles, doc);
