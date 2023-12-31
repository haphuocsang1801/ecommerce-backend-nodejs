"use strict";
const express = require("express");
const accessController = require("../../controllers/access.controller");
const { asyncHandler } = require("../../auth/checkAuth");
const { authentication } = require("../../auth/authUtils");
const router = express.Router();

router.post("/shop/sign-up", asyncHandler(accessController.signUp));
router.post("/shop/sign-in", asyncHandler(accessController.signIn));
//authentication
router.use(authentication);

router.post("/shop/logout", asyncHandler(accessController.logout));
module.exports = router;
