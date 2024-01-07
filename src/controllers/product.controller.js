"use strict";

const ProductService = require("../services/product.service");
const ProductServiceV2 = require("../services/product.service.xxx");
const { SuccessResponse } = require("../core/sucess.response");
class ProductController {
  createProduct = async (req, res, next) => {
    // v1
    // new SuccessResponse({
    //   message: "Create product success!",
    //   metadata: await ProductService.createProduct(req.body.product_type, {
    //     ...req.body,
    //     product_shop: req.user.userId,
    //   }),
    // }).send(res);
    // v1
    new SuccessResponse({
      message: "Create product success!",
      metadata: await ProductServiceV2.createProduct(req.body.product_type, {
        ...req.body,
        product_shop: req.user.userId,
      }),
    }).send(res);
  };
}
module.exports = new ProductController();
