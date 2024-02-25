"use strict"

const DiscountService = require("../services/discount.service")
const { SuccessResponse } = require("../core/sucess.response")

class DiscountController {
  createDiscountCode = async (req, res, next) => {
    new SuccessResponse({
      message: "Create discount code success!",
      metadata: await DiscountService.createDiscountCode({
        ...req.body,
        shopId: req.user.userId,
      }),
    }).send(res)
  }
  getAllDiscountCode = async (req, res, next) => {
    new SuccessResponse({
      message: "Get all discount code success!",
      metadata: await DiscountService.getAllDiscountCodesByShop({
        ...req.query,
        shopId: req.user.userId,
      }),
    }).send(res)
  }
  getDiscountAmount = async (req, res, next) => {
    new SuccessResponse({
      message: "Get discount amount success!",
      metadata: await DiscountService.getDiscountAmount({
        ...req.body,
      }),
    }).send(res)
  }
  getAllDiscountCodesWithProducts = async (req, res, next) => {
    new SuccessResponse({
      message: "Get discount by shop success!",
      metadata: await DiscountService.getAlldiscountCodesWithProducts({
        ...req.query,
      }),
    }).send(res)
  }
}
module.exports = new DiscountController()
