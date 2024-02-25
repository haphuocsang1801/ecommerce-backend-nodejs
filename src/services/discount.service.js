"use strict"

const { BadRequestError, NotFoundError } = require("../core/error.response")
const discountModel = require("../models/discount.model")
const {
  findAllDiscountCodeUnSelect,
  checkDiscountExists,
  findAllDiscountCodeSelect,
} = require("../models/repositories/discount.repo")
const {
  findAllProducts,
  findAllPublishForShop,
} = require("../models/repositories/product.repo")
const { convertToObjectIdMongodb } = require("../utils")
class DiscountService {
  static async createDiscountCode(payload) {
    const {
      code,
      start_date,
      end_date,
      is_active,
      shopId,
      min_order_value,
      product_ids,
      applies_to,
      name,
      description,
      type,
      value,
      max_value,
      max_uses,
      max_uses_per_user,
      users_used,
      uses_count,
    } = payload
    if (new Date(start_date) > new Date(end_date))
      throw new BadRequestError("Discount date must be before end_date")

    const foundDiscount = await discountModel
      .findOne({
        discount_code: code,
        discount_shopId: convertToObjectIdMongodb(shopId),
      })
      .lean()
    if (foundDiscount && foundDiscount.discount_is_active)
      throw new BadRequestError("Discount exits!")

    const newDiscount = await discountModel.create({
      discount_name: name,
      discount_description: description,
      discount_type: type,
      discount_value: value,
      discount_max_value: max_value,
      discount_max_uses: max_uses,
      discount_uses_count: uses_count,
      discount_max_uses_per_user: max_uses_per_user,
      discount_code: code,
      discount_start_date: new Date(start_date),
      discount_end_date: new Date(end_date),
      discount_is_active: is_active,
      discount_min_order_value: min_order_value || 0,
      discount_applies_to: applies_to,
      discount_shopId: shopId,
      discount_product_ids: applies_to === "all" ? [] : product_ids,
      discount_users_used: users_used,
    })
    return newDiscount
  }
  static async updateDiscountCode(payload) {
    const {
      code,
      start_date,
      end_date,
      is_active,
      shopId,
      min_order_value,
      product_ids,
      applies_to,
      name,
      description,
      type,
      value,
      max_value,
      max_uses,
      max_uses_per_user,
      users_used,
      uses_count,
    } = payload

    if (new Date() < new Date(start_date) || new Date() > new Date(end_date)) {
      throw new BadRequestError("Discount code has expried!")
    }
    if (new Date(start_date) > new Date(end_date))
      throw new BadRequestError("Discount date must be before end_date")

    const foundDiscount = await checkDiscountExists({
      model: discountModel,
      filter: {
        discount_code: code,
        discount_shopId: shopId,
      },
    })

    if (!foundDiscount) throw new BadRequestError("Discount not exits!")

    const updateDiscount = await discountModel.findOneAndUpdate(
      {
        discount_code: code,
        discount_shopId: convertToObjectIdMongodb(shopId),
      },
      {
        discount_name: name,
        discount_description: description,
        discount_type: type,
        discount_value: value,
        discount_max_value: max_value,
        discount_max_uses: max_uses,
        discount_uses_count: uses_count,
        discount_max_uses_per_user: max_uses_per_user,
        discount_code: code,
        discount_start_date: new Date(start_date),
        discount_end_date: new Date(end_date),
        discount_is_active: is_active,
        discount_min_order_value: min_order_value || 0,
        discount_applies_to: applies_to,
        discount_product_ids: applies_to === "all" ? [] : product_ids,
        discount_users_used: users_used,
      },
      { new: true }
    )
    return updateDiscount
  }
  /**
   * Get all dícount codes available with products
   */
  static async getAlldiscountCodesWithProducts({ code, shopId, limit, page }) {
    //create index for discount_code
    const foundDiscount = await checkDiscountExists({
      model: discountModel,
      filter: {
        discount_code: code,
        discount_shopId: shopId,
      },
    })
    if (!foundDiscount || !foundDiscount.discount_is_active) {
      throw new NotFoundError("Discount not exits!")
    }
    const { discount_applies_to, discount_product_ids } = foundDiscount
    let products = []
    if (discount_applies_to === "all") {
      products = await findAllProducts({
        filter: {
          product_shop: convertToObjectIdMongodb(shopId),
          isPublish: true,
        },
        limit: +limit,
        page: +page,
        sort: "ctime",
        select: ["product_name"],
      })
    }
    if (discount_applies_to === "specific") {
      products = await findAllProducts({
        filter: {
          _id: {
            $in: discount_product_ids,
          },
          isPublish: true,
        },
        limit: +limit,
        page: +page,
        sort: "ctime",
        select: ["product_name"],
      })
    }
    return products
  }
  static async getAllDiscountCodesByShop({ limit, page, shopId }) {
    const discounts = await findAllDiscountCodeSelect({
      limit: +limit,
      page: +page,
      sort: "ctime",
      filter: {
        discount_shopId: convertToObjectIdMongodb(shopId),
        discount_is_active: true,
      },
      select: ["discount_shopId","__id","discount_name"],
      model: discountModel,
    })
    return discounts
  }
  static async getDiscountAmount({ codeId, userId, shopId, products }) {
    const foundDiscount = await checkDiscountExists({
      model: discountModel,
      filter: {
        discount_code: codeId,
        discount_shopId: shopId,
      },
    })
    if (!foundDiscount) {
      throw new NotFoundError("Discount doesn't exitst")
    }
    const {
      discount_is_active,
      discount_max_uses,
      discount_min_order_value,
      discount_users_used,
      discount_start_date,
      discount_end_date,
      discount_type,
      discount_value,
      discount_max_uses_per_user
    } = foundDiscount
    if (!discount_is_active) throw new NotFoundError("Discount expried!")
    if (!discount_max_uses) throw new NotFoundError("Discount are out!")
    // if (
    //   new Date() < new Date(discount_start_date) ||
    //   new Date() > new Date(discount_end_date)
    // )
    //   NotFoundError("Discount code has expried!")
    //check xem cost gia tri toi thieu hay khong?
    let totalOrder = 0
    if (discount_min_order_value > 0) {
      totalOrder = products.reduce((acc, product) => {
        return acc + product.quantity * product.price
      }, 0)
      if (totalOrder < discount_min_order_value)
        throw new NotFoundError(
          `discount requires a minium order value of ${discount_min_order_value}`
        )
    }
    if (discount_max_uses_per_user > 0) {
      const userUserDiscount = discount_users_used.find(
        (user) => user.userId === userId
      )
      if (userUserDiscount) {
        throw new NotFoundError("You have used this discount code!")
      }
    }
    const amount =
      discount_type === "fixed_amount"
        ? discount_value
        : totalOrder * (discount_value / 100)
    return {
      totalOrder,
      discount: amount,
      totalPrice: totalOrder - amount,
    }
  }
  static async deleteDiscountCode({ shopId, codeId }) {
    const deleted = await discountModel.findOneAndDelete({
      discount_code: codeId,
      discount_shopId: convertToObjectIdMongodb(shopId),
    })
    return deleted
  }
  static async cancelDiscountCode({ shopId, codeId, userId }) {
    const foundDiscount = await checkDiscountExists({
      model: discountModel,
      filter: {
        discount_code: codeId,
        discount_shopId: convertToObjectIdMongodb(shopId),
      },
    })
    if (!foundDiscount) throw new NotFoundError("Discount not exits!")
    const canceled = await discountModel.findOneAndUpdate(foundDiscount._id, {
      $pull: {
        discount_users_used: userId,
      },
      $inc: {
        discount_max_uses: 1,
        discount_uses_count: -1,
      },
    })
    return canceled
  }
}
module.exports = DiscountService