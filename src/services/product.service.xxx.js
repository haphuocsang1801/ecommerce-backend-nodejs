"use strict"
//Factory Pattern for creating different types of products
const {
  product,
  clothing,
  electronic,
  furniture,
} = require("../models/product.model")
const { BadRequestError } = require("../core/error.response")
const productRepo = require("../models/repositories/product.repo")
const invenRepo = require("../models/repositories/inventory.repo")
const { removeUndefinedObject, updatedNestedObjectParser } = require("../utils")
class ProductFactory {
  static productRegistry = {}
  static registerProductType(type, classRef) {
    ProductFactory.productRegistry[type] = classRef
  }
  static async createProduct(type, payload) {
    const ProductClass = ProductFactory.productRegistry[type]
    if (!ProductClass)
      throw new BadRequestError(`Invalid product type:: ${type}`)
    return await new ProductClass(payload).createProduct()
  }
  static async updateProduct(type, productId, payload) {
    const ProductClass = ProductFactory.productRegistry[type]
    if (!ProductClass)
      throw new BadRequestError(`Invalid product type:: ${type}`)
    return new ProductClass(payload).updateProduct(productId)
  }
  //PUT
  static async publishProductByShop({ product_shop, product_id }) {
    return await productRepo.publishProductByShop({
      product_id,
      product_shop,
    })
  }
  static async unPublishProductByShop({ product_shop, product_id }) {
    return await productRepo.unPublishProductByShop({
      product_id,
      product_shop,
    })
  }
  // END PUT //

  //QUERY
  static async findAllDraftForShop({ product_shop, limit = 50, skip = 0 }) {
    const query = {
      product_shop,
      isDraft: true,
    }
    return await productRepo.findAllDarftForShop({ query, limit, skip })
  }
  static async findAllPublishForShop({ product_shop, limit = 50, skip = 0 }) {
    const query = {
      product_shop,
      isPublish: true,
    }
    return await productRepo.findAllPublishForShop({ query, limit, skip })
  }
  static async searchProducts({ keySearch }) {
    return await productRepo.searchProductsByUser({ keySearch })
  }
  static async findAllProducts({
    limit = 50,
    sort = "ctime",
    page = 1,
    filter = { isPublish: true },
  }) {
    return await productRepo.findAllProducts({
      limit,
      filter,
      page,
      select: ["product_name", "product_price", "product_thumb"],
      sort,
    })
  }
  static async findProduct({ product_id }) {
    return await productRepo.findProduct({
      product_id,
      unSelect: ["__v"],
    })
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
    this.product_name = product_name
    this.product_thumb = product_thumb
    this.product_price = product_price
    this.product_description = product_description
    this.product_quantity = product_quantity
    this.product_type = product_type
    this.product_shop = product_shop
    this.product_attributes = product_attributes
  }
  async createProduct(productId) {
    const newProduct = await product.create({ ...this, _id: productId })
    if (newProduct) {
      //add product_stock in inventory collection
      await invenRepo.insertInventory({
        productId: newProduct.id,
        shopId: this.product_shop,
        stock: this.product_quantity,
      })
    }
    return newProduct
  }
  async updateProduct(productId, bodyUpdate) {
    return await productRepo.updateProductById({
      productId,
      bodyUpdate,
      model: product,
    })
  }
}

//define sub-class for different product types clothing
class Clothing extends Product {
  async createProduct() {
    const newClothing = await clothing.create({
      ...this.product_attributes,
      product_shop: this.product_shop,
    })
    if (!newClothing) throw new BadRequestError("Cannot create new clothing")
    const newProduct = await super.createProduct(newClothing._id)
    if (!newProduct) throw new BadRequestError("Cannot create new product")
    return newProduct
  }
  async updateProduct(productId) {
    //1.remove attriute null or undefined
    const objectParams = removeUndefinedObject(updateNest)
    //2.check xem update ở chỗ nào
    if (objectParams.product_attributes) {
      //update child
      await productRepo.updateProductById({
        productId,
        bodyUpdate: updatedNestedObjectParser(objectParams.product_attributes),
        model: clothing,
      })
    }
    return await super.updateProduct(
      productId,
      updatedNestedObjectParser(objectParams)
    )
  }
}
//define sub-class for different product types electronics
class Electronic extends Product {
  async createProduct() {
    const newElectornic = await electronic.create({
      ...this.product_attributes,
      product_shop: this.product_shop,
    })
    if (!newElectornic)
      throw new BadRequestError("Cannot create new electronic")
    const newProduct = await super.createProduct(newElectornic._id)
    if (!newProduct) throw new BadRequestError("Cannot create new product")
    return newProduct
  }
  async updateProduct(productId) {
    //1.remove attriute null or undefined
    const objectParams = removeUndefinedObject(updateNest)
    //2.check xem update ở chỗ nào
    if (objectParams.product_attributes) {
      //update child
      await productRepo.updateProductById({
        productId,
        bodyUpdate: updatedNestedObjectParser(objectParams.product_attributes),
        model: electronic,
      })
    }
    return await super.updateProduct(
      productId,
      updatedNestedObjectParser(objectParams)
    )
  }
}
//define sub-class for different product types electronics
class Furniture extends Product {
  async createProduct() {
    const newFurniture = await furniture.create({
      ...this.product_attributes,
      product_shop: this.product_shop,
    })
    if (!newFurniture) throw new BadRequestError("Cannot create new furniture")
    const newProduct = await super.createProduct(newFurniture._id)
    if (!newProduct) throw new BadRequestError("Cannot create new product")
    return newProduct
  }
  async updateProduct(productId) {
    //1.remove attriute null or undefined
    const objectParams = removeUndefinedObject(updateNest)
    //2.check xem update ở chỗ nào
    if (objectParams.product_attributes) {
      //update child
      await productRepo.updateProductById({
        productId,
        bodyUpdate: updatedNestedObjectParser(objectParams.product_attributes),
        model: furniture,
      })
    }
    return await super.updateProduct(
      productId,
      updatedNestedObjectParser(objectParams)
    )
  }
}
//register product types
ProductFactory.registerProductType("Clothing", Clothing)
ProductFactory.registerProductType("Electronic", Electronic)
ProductFactory.registerProductType("Furniture", Furniture)
module.exports = ProductFactory
