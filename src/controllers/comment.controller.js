"use strict"
const { SuccessResponse } = require("../core/sucess.response")
const {
  createComment,
  getCommnetByParentId,
  deleteComment,
} = require("../services/commnet.service")

class CommentController {
  createComment = async (req, res, next) => {
    new SuccessResponse({
      message: "Create comment success!",
      metadata: await createComment(req.body),
    }).send(res)
  }
  getCommnetByParentId = async (req, res, next) => {
    new SuccessResponse({
      message: "Get comment success!",
      metadata: await getCommnetByParentId(req.query),
    }).send(res)
  }
  deleteCommentById = async (req, res, next) => {
    new SuccessResponse({
      message: "Delete comment success!",
      metadata: await deleteComment(req.body),
    }).send(res)
  }
}
module.exports = new CommentController()
