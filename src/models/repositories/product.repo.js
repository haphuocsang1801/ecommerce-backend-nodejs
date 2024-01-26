"use strict";
const {
  product,
  electronic,
  clothing,
  furniture,
} = require("../product.model");

const findAllDarftForShop = async ({ query, limit = 50, skip = 0 }) => {
  return await product
    .find(query)
    .populate("product_shop", "name email -_id")
    .sort({ updateAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean()
    .exec();
};
module.exports = {
  findAllDarftForShop,
};
