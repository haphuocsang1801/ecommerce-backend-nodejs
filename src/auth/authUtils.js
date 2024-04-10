"use strict";
const jwt = require("jsonwebtoken");
const asyncHandler = require("../helpers/asyncHandler");
const { AuthFailureError, NotFoundError } = require("../core/error.response");
const { findByUserId } = require("../services/keyToken.service");
const HEADER = {
  API_KEY: "x-api-key",
  AUTHORIZATION: "authorization",
  CLIENT_ID: "x-client-id",
  REFERSHTOKEN: "x-rtoken-id",
};
const createTokenPair = async (payload, publicKey, privateKey) => {
  try {
    const accessToken = await jwt.sign(payload, privateKey, {
      // algorithm: "RS256",
      expiresIn: "2 days",
    });
    const refreshToken = jwt.sign(payload, privateKey, {
      // algorithm: "RS256",
      expiresIn: "7 days",
    });
    jwt.verify(accessToken, publicKey, (err, decoded) => {
      if (err) console.log(err);
      else console.log({ decoded });
    });
    return { accessToken, refreshToken };
  } catch (error) {
    return error;
  }
};
const authentication = asyncHandler(async (req, res, next) => {
  /*
    1- check userId missing?
    2- get accessToken
    3- verifyToken
    4- check user in db
    5- check keyStore with this userId?
    6- OK all => return next()
  */
  //1
  const userId = req.headers[HEADER.CLIENT_ID];
  if (!userId) {
    throw new AuthFailureError("Invalid Request");
  }
  //2
  const keyStore = await findByUserId(userId);
  if (!keyStore) {
    throw new NotFoundError("KeyStore not found");
  }
  //3
  const accessToken = req.headers[HEADER.AUTHORIZATION];
  if (!accessToken) {
    throw new AuthFailureError("Invalid Request");
  }
  try {
    const decoded = jwt.verify(accessToken, keyStore.privateKey);
    if (userId !== decoded.userId) throw new AuthFailureError("Invalid UserId");
    req.keyStore = keyStore;
    return next();
  } catch (error) {
    throw error;
  }
});
const authenticationV2 = asyncHandler(async (req, res, next) => {
  /*
    1- check userId missing?
    2- get accessToken
    3- verifyToken
    4- check user in db
    5- check keyStore with this userId?
    6- OK all => return next()
  */
  //1
  const userId = req.headers[HEADER.CLIENT_ID];
  if (!userId) {
    throw new AuthFailureError("Invalid Request");
  }
  //2
  const keyStore = await findByUserId(userId);
  if (!keyStore) {
    throw new NotFoundError("KeyStore not found");
  }
  //3
  if (req.headers[HEADER.REFERSHTOKEN]) {
    try {
      const refreshToken = req.headers[HEADER.REFERSHTOKEN];
      const decodedUser = jwt.verify(refreshToken, keyStore.privateKey)
      if (userId !== decodedUser.userId) throw new AuthFailureError("Invalid UserId");
      req.keyStore = keyStore;
      req.user = decodedUser;
      req.refreshToken = refreshToken;
      return next();
    } catch (error) {
      throw error;
    }
  }
  const accessToken = req.headers[HEADER.AUTHORIZATION];
  if (!accessToken) {
    throw new AuthFailureError("Invalid Request");
  }
  try {
    const decoded = jwt.verify(accessToken, keyStore.privateKey);
    if (userId !== decoded.userId) throw new AuthFailureError("Invalid UserId");
		req.keyStore = keyStore;
		req.user = decoded;
    return next();
  } catch (error) {
    throw error;
  }
});
const verifyJWT = async (token, keySecret) => {
  return await jwt.verify(token, keySecret);
};
module.exports = {
  createTokenPair,
  authentication,
  verifyJWT,
  authenticationV2
};
