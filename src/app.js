require("dotenv").config();
const compression = require("compression");
const express = require("express");
const { default: helmet } = require("helmet");
const morgan = require("morgan");
const app = express();
require('./tests/inventory.test')

// Middleware
app.use(morgan("dev"));
app.use(helmet());
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const product = require("./tests/product.test")
product.purchaseProduct("1", 2)
//init db
require("./dbs/init.mongodb");
// const { countConnection,checkOverLoad } = require("./helpers/check.connect");
// countConnection()
// checkOverLoad()
// init Routes
app.use("", require("./routers"));


// Error handler
app.use((req, res, next) => {
  const error = new Error("Resource not found");
  error.status = 404;
  next(error);
});
app.use((error, req, res, next) => {
  const status = error.status || 500;
  return res.status(status).json({
    code: status,
    stack: error.stack,
    message: error.message || "Internal Server Error",
  });
});
module.exports = app;
