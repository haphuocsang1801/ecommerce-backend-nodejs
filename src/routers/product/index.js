"use strict";
const express = require("express");
const productController = require("../../controllers/product.controller");
const { asyncHandler } = require("../../auth/checkAuth");
const { authenticationV2 } = require("../../auth/authUtils");
const router = express.Router();

router.get("/search/:keySearch", asyncHandler(productController.getListSearchProduct));
router.get("", asyncHandler(productController.findAllProducts));
router.get("/:product_id", asyncHandler(productController.findProduct));

//authentication
router.use(authenticationV2);

router.post("/publish/:id", asyncHandler(productController.publishProductByShop));
router.post("/unpublish/:id", asyncHandler(productController.unPublishProductByShop));
router.post("", asyncHandler(productController.createProduct));
router.patch("/:productId", asyncHandler(productController.updateProduct));

//QUERY
router.get("/drafts/all", asyncHandler(productController.getAllDraftsForShop));
router.get("/published/all", asyncHandler(productController.getAllPublishForShop));
module.exports = router;
