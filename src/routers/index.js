"use strict"
const express = require("express")
const router = express.Router()
const { apiKey, permission } = require("../auth/checkAuth")
const { pushToDiscord } = require("../middlewares")
//add log to discord
router.use(pushToDiscord)
//check apikey
router.use(apiKey)
//check permission
router.use(permission("0000"))
router.use("/v1/api/product", require("./product"))
router.use("/v1/api/discount", require("./discount"))
router.use("/v1/api/cart", require("./cart"))
router.use("/v1/api/comment", require("./comment"))
router.use("/v1/api/notification", require("./notifications"))
router.use("/v1/api", require("./access"))
module.exports = router
