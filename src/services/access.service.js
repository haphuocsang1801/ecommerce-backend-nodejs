"use strict";
const shopModel = require("../models/shop.model");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const KeyTokenService = require("./keyToken.service");
const { createTokenPair, verifyJWT } = require("../auth/authUtils");
const { getInfoData } = require("../utils");
const { BadRequestError, AuthFailureError, ForBiddenError } = require("../core/error.response");
const { findByEmail } = require("./shop.service");
const RoleShop = {
  SHOP: "SHOP",
  WRITER: "WRITER",
  EDITOR: "EDITOR",
  ADMIN: "ADMIN",
};

class AccessService {
  static async signUp({ name, email, password }) {
    // try {
    //step1: check email exist
    const holderShop = await shopModel.findOne({ email }).lean(); // lean return object not mongoose object
    if (holderShop) {
      throw new BadRequestError("Error: Shop already registered");
    }
    //step2: create shop
    const passwordHash = await bcrypt.hash(password, 10);
    const newShop = await shopModel.create({
      name,
      email,
      password: passwordHash,
      roles: [RoleShop.SHOP],
    });
    if (newShop) {
      //created privateKey, publicKey
      //level 2
      // const { privateKey, publicKey } = crypto.generateKeyPairSync("rsa", {
      //   modulusLength: 4096,
      //   publicKeyEncoding: {
      //     type: "pkcs1",
      //     format: "pem",
      //   },
      //   privateKeyEncoding: {
      //     type: "pkcs1",
      //     format: "pem",
      //   },
      // });
      //level 1
      const privateKey = crypto.randomBytes(64).toString("hex");
      const publicKey = crypto.randomBytes(64).toString("hex");
      console.log({ privateKey, publicKey });
      // const publicKeyString = await KeyTokenService.createKeyToken({
      //   userId: newShop._id,
      //   publicKey,
      // });
      const keyStore = await KeyTokenService.createKeyToken({
        userId: newShop._id,
        publicKey,
        privateKey,
      });
      // if (!publicKeyString) {
      //   return {
      //     code: "xxx",
      //     message: "publicKeyString error",
      //   };
      // }
      if (!keyStore) {
        throw new BadRequestError("Error: keyStore error");
      }

      // const publicKeyObject = crypto.createPublicKey(publicKeyString);
      //create token pair
      const tokens = await createTokenPair(
        { userId: newShop._id, email: newShop.email },
        publicKey,
        privateKey
      );
      console.log("Created token success::", tokens);
      return {
        code: 201,
        metadata: {
          shop: getInfoData({
            fields: ["_id", "name", "email"],
            object: newShop,
          }),
          tokens,
        },
      };
    }
    return {
      code: 200,
      metadata: null,
    };
    // } catch (error) {
    //   return {
    //     code: "xxx",
    //     message: error.message,
    //     status: "error",
    //   };
    // }
  }
  static async signIn({ email, password, refreshToken = null }) {
    const foundShop = await findByEmail({ email });
    if (!foundShop) {
      throw new BadRequestError("Error: Shop not registered");
    }
    const isMatch = await bcrypt.compare(password, foundShop.password);
    if (!isMatch) {
      throw new AuthFailureError("Authentication failure");
    }
    const privateKey = crypto.randomBytes(64).toString("hex");
    const publicKey = crypto.randomBytes(64).toString("hex");
    const { _id: userId } = foundShop;
    const tokens = await createTokenPair(
      { userId, email: foundShop.email },
      publicKey,
      privateKey
    );
    await KeyTokenService.createKeyToken({
      userId,
      publicKey,
      privateKey,
      refreshToken: tokens.refreshToken,
    });
    return {
      shop: getInfoData({
        fields: ["_id", "name", "email"],
        object: foundShop,
      }),
      tokens,
    }
  }
  static async logout({ keyStore }) {
    const delKey = await KeyTokenService.removeKeyById(keyStore._id);
    return delKey;
  }
  static async handlerRefreshToken(refreshToken) {
    console.log("AccessService : handlerRefreshToken : refreshToken:", refreshToken)
    //check token exist
    const foundToken = await KeyTokenService.findByRefreshTokenUsed(refreshToken);
    if (foundToken) {
      const { userId, email } = await verifyJWT(refreshToken, foundToken.privateKey);
      console.log({ userId, email });
      //if token exist, delete token
      await KeyTokenService.deleteKeyById(userId);
      throw new ForBiddenError('Something wrong happened!! pks re-login')
    }
    const holderToken = await KeyTokenService.findByRefreshToken(refreshToken);
    if (!holderToken) {
      throw new AuthFailureError('Shop not registered 1')
    }
    //verifyToken
    const { userId, email } = await verifyJWT(refreshToken, holderToken.privateKey);
    console.log('[2]---', { userId, email });
    //check User id
    const foundShop = await findByEmail({ email });
    if (!foundShop) {
      throw new AuthFailureError('Shop not registered 2')
    }
    //create new couple token
    const tokens = await createTokenPair({ userId, email }, holderToken.publicKey, holderToken.privateKey);
    //update token
    await holderToken.updateOne({
      $set: {
        refreshToken: tokens.refreshToken,
      },
      $addToSet: {
        refreshTokensUsed: refreshToken,
      }
    })
    return {
      user: { userId, email },
      tokens
    }
  }
}

module.exports = AccessService;
