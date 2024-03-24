"use strict"
const Logger = require("../loggers/discord.log.v2")

const pushToDiscord = async (req, res, next) => {
  try {
    Logger.sendToFomatCode({
      title: `Method: ${req.method}`,
      code: req.method === "GET" ? req.query : req.body,
      message: `Request to ${req.get("host")}${req.originalUrl} from ${
        req.ip
      } at ${new Date().toLocaleString()}`,
    })
    return next()
  } catch (error) {
    next(error)
  }
}

module.exports = {
  pushToDiscord,
}
