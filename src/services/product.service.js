"use strict";
//Factory Pattern for creating different types of products
const { product, clothing, electronic } = require("../models/product.model");
const { BadRequestError } = require("../core/error.response");
class ProductFactory {
  static async createProduct(type, payload) {
    switch (type) {
      case "Clothing":
        return await new Clothing(payload).createProduct();
      case "Electronic":
        return await new Electronic(payload).createProduct();
      default:
        throw new BadRequestError("Invalid product type");
    }
  }
}
class Product {
  constructor({
    product_name,
    product_thumb,
    product_price,
    product_description,
    product_quantity,
    product_type,
    product_shop,
    product_attributes,
  }) {
    this.product_name = product_name;
    this.product_thumb = product_thumb;
    this.product_price = product_price;
    this.product_description = product_description;
    this.product_quantity = product_quantity;
    this.product_type = product_type;
    this.product_shop = product_shop;
    this.product_attributes = product_attributes;
  }
  async createProduct(productId) {
    return await product.create({ ...this, product_id: productId });
  }
}

//define sub-class for different product types clothing
class Clothing extends Product {
  async createProduct() {
    const newClothing = await clothing.create({
      ...this.product_attributes,
      product_shop: this.product_shop,
    });
    if (!newClothing) throw new BadRequestError("Cannot create new clothing");
    const newProduct = await super.createProduct(newClothing._id);
    if (!newProduct) throw new BadRequestError("Cannot create new product");
    return newProduct;
  }
}
//define sub-class for different product types electronics
class Electronic extends Product {
  async createProduct() {
    const newElectornic = await electronic.create({
      ...this.product_attributes,
      product_shop: this.product_shop,
    });
    if (!newElectornic)
      throw new BadRequestError("Cannot create new electronic");
    const newProduct = await super.createProduct(newElectornic._id);
    if (!newProduct) throw new BadRequestError("Cannot create new product");
    return newProduct;
  }
}
module.exports = ProductFactory;
