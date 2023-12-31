"use strict";

const AccessService = require("../services/access.service");
const { OK, CREATED, SuccessResponse } = require("../core/sucess.response");
class AccessController {
  logout = async (req, res, next) => {
    new SuccessResponse({
      message: "logout success!",
      metadata: await AccessService.logout({
        keyStore: req.keyStore,
      }),
    }).send(res);
  };
  signIn = async (req, res, next) => {
    new SuccessResponse({
      message: "Login Ok!",
      metadata: await AccessService.signIn(req.body),
    }).send(res);
  };
  signUp = async (req, res, next) => {
    console.log(`[P]::signUp::`, req.body);
    new CREATED({
      message: "Registered Ok!",
      metadata: await AccessService.signUp(req.body),
    }).send(res);
  };
}
module.exports = new AccessController();
