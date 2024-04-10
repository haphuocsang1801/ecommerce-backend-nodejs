"use strict"
const { NotFoundError } = require("../core/error.response")
const Comment = require("../models/comment.model")
const { convertToObjectIdMongodb } = require("../utils")
const { findProduct } = require("./product.service.xxx")

class CommentService {
  static async createComment({
    productId,
    userId,
    content,
    parentCommentId = null,
  }) {
    const comment = new Comment({
      comment_productId: productId,
      comment_userId: userId,
      comment_content: content,
      comment_parentId: parentCommentId,
    })

    let rightValue
    if (parentCommentId) {
      //rely comment
      const parentComment = await Comment.findById(parentCommentId)
      if (!parentComment) throw new NotFoundError("Comment not found")
      rightValue = parentComment.comment_right
      await Comment.updateMany(
        {
          comment_productId: convertToObjectIdMongodb(productId),
          comment_right: {
            $gte: rightValue,
          },
        },
        {
          $inc: {
            comment_right: 2,
          },
        }
      )
      await Comment.updateMany(
        {
          comment_productId: convertToObjectIdMongodb(productId),
          comment_left: {
            $gt: rightValue,
          },
        },
        {
          $inc: {
            comment_left: 2,
          },
        }
      )
    } else {
      const maxRightValue = await Comment.findOne(
        {
          comment_productId: convertToObjectIdMongodb(productId),
        },
        "comment_right",
        {
          sort: { comment_right: -1 },
        }
      )
      if (maxRightValue) {
        rightValue = maxRightValue.comment_right + 1
      } else {
        rightValue = 1
      }
    }
    //insert to comment
    comment.comment_left = rightValue
    comment.comment_right = rightValue + 1
    await comment.save()
    return comment
  }
  static async getCommnetByParentId({
    productId,
    parentCommentId,
    limit = 50,
    offset = 0,
  }) {
    if (parentCommentId) {
      const parent = await Comment.findById(parentCommentId)
      if (!parent) throw new NotFoundError("Comment not found")
      const comments = await Comment.find({
        comment_left: {
          $gt: parent.comment_left,
        },
        comment_right: {
          $lt: parent.comment_right,
        },
      })
        .select({
          comment_content: 1,
          comment_left: 1,
          comment_right: 1,
          comment_parentId: 1,
        })
        .sort({
          comment_left: 1,
        })
        .limit(limit)
        .skip(offset)
      return comments
    }
    const comments = await Comment.find({
      productId: convertToObjectIdMongodb(productId),
      comment_parentId: parentCommentId,
    })
      .select({
        comment_content: 1,
        comment_left: 1,
        comment_right: 1,
        comment_parentId: 1,
      })
      .sort({
        comment_left: 1,
      })
      .limit(limit)
      .skip(offset)
    return comments
  }
  static async deleteComment({ commentId, productId }) {
    // 1. check the product exits in database
    const foundProduct = await findProduct({
      product_id: productId,
    })
    if (!foundProduct) throw new NotFoundError("Product not found")
    // 2. check the comment exits in database
    const foundComment = await Comment.findById(commentId)
    if (!foundComment) throw new NotFoundError("Comment not found")
    // 3. delete the comment
    const rightValue = foundComment.comment_right
    const leftValue = foundComment.comment_left

    const width = rightValue - leftValue + 1

    await Comment.deleteMany({
      comment_productId: convertToObjectIdMongodb(productId),
      comment_left: {
        $lte: rightValue,
        $gte: leftValue,
      },
		})
		// 4. update the left and right value of the comment
    await Comment.updateMany(
      {
        comment_productId: convertToObjectIdMongodb(productId),
        comment_right: {
          $gt: rightValue,
        },
      },
      {
        $inc: {
          comment_right: -width,
        },
      }
    )
    await Comment.updateMany(
      {
        comment_productId: convertToObjectIdMongodb(productId),
        comment_left: {
          $gt: rightValue,
        },
      },
      {
        $inc: {
          comment_left: -width,
        },
      }
    )
		return true
  }
}
module.exports = CommentService
