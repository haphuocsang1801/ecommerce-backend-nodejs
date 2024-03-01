"use strict"
const { model, Schema } = require("mongoose")

const DOCUMENT_NAME = "Cart"
const COLLECTION_NAME = "Carts"

const cartSchema = new Schema(
  {
    cart_state: {
      type: String,
      require: true,
      enum: ["active", "completed", "failed"],
      default: "active",
    },
    cart_products: {
      type: Array,
      require: true,
      default: [],
    },
    cart_count_products: {
      type: Number,
      require: true,
      default: 0,
    },
    cart_userId: {
      type: Number,
      require: true,
    },
  },
  {
    timestamps: {
      createdAt: "createdOn",
      updatedAt: "modifiedOn",
    },
    collection: COLLECTION_NAME,
  }
)
module.exports = {
  cart: model(DOCUMENT_NAME, cartSchema),
}
