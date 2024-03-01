"use strict"

const { NotFoundError } = require("../core/error.response")
const { cart } = require("../models/cart.model")
const { getProductById } = require("../models/repositories/product.repo")
const { convertToObjectIdMongodb } = require("../utils")

class CartService {
  /// START REPO CART ///
  static async createUserCart({ userId, product }) {
    const query = {
        cart_userId: userId,
        cart_state: "active",
      },
      updateOrInsert = {
        $addToSet: {
          cart_products: product,
        },
      },
      options = {
        upsert: true,
        new: true,
      }
    return await cart.findOneAndUpdate(query, updateOrInsert, options)
  }
  static async updateUserCardQuantity({ userId, product }) {
    const { productId, quantity } = product
    console.log("CartService : updateUserCardQuantity : product:", product)
    const query = {
				cart_userId: userId,
        "cart_products.productId": convertToObjectIdMongodb(productId),
        cart_state: "active",
      },
      updateSet = {
        $inc: {
          "cart_products.$.quantity": quantity,
        },
      },
      options = {
        upsert: true,
        new: true,
      }
    return await cart.findOneAndUpdate(query, updateSet, options)
  }
  /// END REPO CART ///
  static async addToCart({ userId, product = {} }) {
    //check cart exists
    const userCart = await cart.findOne({
      cart_userId: userId,
    })
    const foundProduct = await getProductById(product.productId)
    if (!foundProduct) {
      throw new NotFoundError("Product not found")
    }
    const productCart = {
      productId: foundProduct._id,
      shopId: foundProduct.product_shop,
      price: foundProduct.product_price,
      name: foundProduct.product_name,
      quantity: product.quantity,
    }
    if (!userCart) {
      return await CartService.createUserCart({ userId, productCart })
    }
    // neu co gio hang roi nhung chua có san pham
    if (!userCart.cart_products.length) {
      userCart.cart_products = [productCart]
      return await userCart.save()
    }
    //gio hang ton tai, vaf cos san pham thi update quantity
    return await CartService.updateUserCardQuantity({ userId, productCart })
  }
  static async addToCartV2({ userId, shop_order_ids = {} }) {
    const { productId, quantity, old_quantity } = shop_order_ids[0]?.item_products[0]
    const foundProduct = await getProductById(productId)
    if (!foundProduct) throw new NotFoundError("Product not found")
    if (foundProduct.product_shop.toString() !== shop_order_ids[0]?.shopId)
      throw new NotFoundError("Product do not belong to the shop")
    if (quantity === 0) {
			return await CartService.deleteUserCart({ userId, productId })
    }
    return await CartService.updateUserCardQuantity({
      userId,
      product: {
        productId,
        quantity: quantity - old_quantity,
      },
    })
  }
  static async deleteUserCart({ userId, productId }) {
    const query = { cart_userId: userId, cart_state: "active" },
      updateSet = {
        $pull: {
          cart_products: {
            productId: convertToObjectIdMongodb(productId),
          },
        },
      }
    const deleteCart = await cart.updateOne(query, updateSet)
    return deleteCart
  }
  static async getListUserCart({ userId }) {
    return await cart
      .findOne({ cart_userId: userId, cart_state: "active" })
      .lean()
  }
}
module.exports = CartService
