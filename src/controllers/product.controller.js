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

  publishProductByShop = async (req, res, next) => {
    new SuccessResponse({
      message: "publishProductByShop success!",
      metadata: await ProductServiceV2.publishProductByShop({
        product_id: req.params.id,
        product_shop: req.user.userId,
      }),
    }).send(res);
  }

  // QUERY //
  /**
   * @description Get All Drafts for shop
   * @param {Number} limt
   * @param {Number} skip
   * @return {JSON}
   */
  getAllDraftsForShop = async (req, res, next) => {
     new SuccessResponse({
      message: "Get list drafts success!",
      metadata: await ProductServiceV2.findAllDraftForShop({
        product_shop: req.user.userId,
      }),
    }).send(res);
  };
  getAllPublishForShop = async (req, res, next) => {
    new SuccessResponse({
     message: "Get list publish success!",
     metadata: await ProductServiceV2.findAllPublishForShop({
       product_shop: req.user.userId,
     }),
   }).send(res);
 };
}
module.exports = new ProductController();