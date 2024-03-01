"use strict"

const CartService = require("../services/cart.service")
const { SuccessResponse } = require("../core/sucess.response")

class CartController {
	addToCart = async (req, res, next) => {
		new SuccessResponse({
			message: "Add to cart success!",
			metadata: await CartService.addToCart(req.body),
		}).send(res)
	}
	update = async (req, res, next) => {
		console.log(req.body);
		new SuccessResponse({
			message: "Update cart success!",
			metadata: await CartService.addToCartV2(req.body),
		}).send(res)
	}
	delete = async (req, res, next) => {
		new SuccessResponse({
			message: "Delete cart success!",
			metadata: await CartService.deleteUserCart(req.body),
		}).send(res)
	}
	listToCart = async (req, res, next) => {
		new SuccessResponse({
			message: "Get cart success!",
			metadata: await CartService.getListUserCart({
				userId: req.query.userId,
			}),
		}).send(res)
	}
}
module.exports = new CartController()
