"use strict";

const ProductService = require("../services/product.service");
const { OK, CREATED, SuccessResponse } = require("../core/sucess.response");
class ProductController {
  createProduct = async (req, res, next) => {
    new SuccessResponse({
      message: "Create product success!",
      metadata: await ProductService.createProduct(
        req.body.product_type,
        req.body
      ),
    }).send(res);
  };
}
module.exports = new ProductController();
