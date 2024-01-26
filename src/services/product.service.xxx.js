"use strict";
//Factory Pattern for creating different types of products
const { product, clothing, electronic,furniture } = require("../models/product.model");
const { BadRequestError } = require("../core/error.response");
const productRepo = require("../models/repositories/product.repo");
class ProductFactory {

  static productRegistry = {}
  static registerProductType(type, classRef) {
    ProductFactory.productRegistry[type] = classRef;
  }
  static async createProduct(type, payload) {
    const ProductClass = ProductFactory.productRegistry[type];
    if (!ProductClass) throw new BadRequestError(`Invalid product type:: ${type}`);
    return await new ProductClass(payload).createProduct();
  }
  static async findAllDraftForShop({ product_shop, limit = 50, skip = 0 }) {
    const query = {
      product_shop,
      isDraft: true,
    };
    return await productRepo.findAllDarftForShop({ query, limit, skip });
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
    return await product.create({ ...this, _id: productId });
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
//define sub-class for different product types electronics
class Furniture extends Product {
  async createProduct() {
    const newFurniture = await furniture.create({
      ...this.product_attributes,
      product_shop: this.product_shop,
    });
    if (!newFurniture)
      throw new BadRequestError("Cannot create new furniture");
    const newProduct = await super.createProduct(newFurniture._id);
    if (!newProduct) throw new BadRequestError("Cannot create new product");
    return newProduct;
  }
}
//register product types
ProductFactory.registerProductType("Clothing", Clothing);
ProductFactory.registerProductType("Electronic", Electronic);
ProductFactory.registerProductType("Furniture", Furniture);
module.exports = ProductFactory;
