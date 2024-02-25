"use strict"
const { model, Schema } = require("mongoose")

const DOCUMENT_NAME = "Discount"
const COLLECTION_NAME = "discounts"

const discountSchema = new Schema(
  {
    discount_name: {
      type: String,
      require: true,
    },
    discount_description: {
      type: String,
    },
    discount_type: {
      type: String,
      default: "fixed_amount", //percentage
    },
    discount_value: {
      type: Number, //10,000 or 10%
      require: true,
    },
    discount_code: {
      type: String,
      require: true,
    },
    discount_start_date: {
      type: Date,
      require: true,
    },
    discount_end_date: {
      type: Date,
      require: true,
    },
    discount_max_uses: {
      //So luong discount duoc áp dụng
      type: Number,
      require: true,
    },
    discount_uses_count: {
      // số lượng discount đã sử dụng
      type: Number,
      require: true,
    },
    discount_users_used: {
      //who used this discount
      type: Array,
      default: [],
    },
    discount_max_uses_per_user: {
      //số lượng tối đa đc sử dụng mỗi user
      type: Number,
      require: true,
    },
    discount_min_order_value: {
      type: Number,
      require: true,
    },
    discount_shopId: {
      type: Schema.Types.ObjectId,
      ref: "Shop",
    },
    discount_is_active: {
      type: Boolean,
      default: true,
    },
    discount_applies_to: {
      type: String,
      required: true,
      enum: ["all", "specific"],
    },
    discount_product_ids: { type: Array, default: [] },
  },
  {
    collection: COLLECTION_NAME,
    timestamps: true,
  }
)
module.exports = model(DOCUMENT_NAME, discountSchema)
