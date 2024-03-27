"use strict"
const { SuccessResponse } = require("../core/sucess.response")
const { createComment, getCommnetByParentId } = require("../services/commnet.service")

class CommentController {
  createComment = async (req, res, next) => {
    new SuccessResponse({
      message: "Create comment success!",
      metadata: await createComment(req.body),
    }).send(res)
	}
	getCommnetByParentId = async (req, res, next) => {
		console.log("CommentController : getCommnetByParentId= : req.query:", req.query)
		new SuccessResponse({
			message: "Get comment success!",
			metadata: await getCommnetByParentId(req.query),
		}).send(res)
	}
}
module.exports = new CommentController()