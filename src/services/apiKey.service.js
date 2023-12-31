'use strict'

const apikeyModel = require("../models/apikey.model")
const crypto = require("crypto")
const findById = async (key) => {
  // const apikey1 = await apikeyModel.create({
  //   key: crypto.randomBytes(64).toString("hex"), status: true,
  //   permissions: ["0000"]
  // })
  const objectKey = await apikeyModel.findOne({ key, status: true }).lean()
  return objectKey
}
module.exports = {
  findById
}
