"use strict"
const { SuccessResponse } = require("../core/sucess.response")
const {
  listNotiByUser
} = require("../services/notification.service")

class NotificationController {
  listNotiByUser = async (req, res, next) => {
    new SuccessResponse({
      message: "Get notification success!",
      metadata: await listNotiByUser(req.query),
    }).send(res)
  }
}
module.exports = new NotificationController()
