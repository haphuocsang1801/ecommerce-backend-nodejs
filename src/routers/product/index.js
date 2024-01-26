"use strict";
const express = require("express");
const productController = require("../../controllers/product.controller");
const { asyncHandler } = require("../../auth/checkAuth");
const { authenticationV2 } = require("../../auth/authUtils");
const router = express.Router();
//authentication
router.use(authenticationV2);
router.post("/publish/:id", asyncHandler(productController.publishProductByShop));
router.post("", asyncHandler(productController.createProduct));

//QUERY
router.get("/drafts/all", asyncHandler(productController.getAllDraftsForShop));
router.get("/published/all", asyncHandler(productController.getAllPublishForShop));
module.exports = router;
