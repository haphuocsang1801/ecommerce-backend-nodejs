"use strict"
const express = require("express")
const CommentController = require("../../controllers/comment.controller")
const { asyncHandler } = require("../../auth/checkAuth")
const { authenticationV2 } = require("../../auth/authUtils")
const router = express.Router()

//authentication
router.use(authenticationV2)

router.post("", asyncHandler(CommentController.createComment))
router.get("/", asyncHandler(CommentController.getCommnetByParentId))

//QUERY
module.exports = router
