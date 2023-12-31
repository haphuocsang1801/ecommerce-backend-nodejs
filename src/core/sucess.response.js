"use strict";
const STATUS_CODE = {
  OK: 200,
  CREATED: 201,
};
const ReasonStatusCode = {
  OK: "Success",
  CREATED: "created!",
};

class SuccessResponse {
  constructor({
    message,
    statusCode = STATUS_CODE.OK,
    reasonStatusCode = ReasonStatusCode.OK,
    metadata = {},
  }) {
    this.message = !message ? reasonStatusCode : message;
    this.statusCode = statusCode;
    this.metadata = metadata;
  }
  send(res, headers = {}) {
    return res.status(this.statusCode).json({
      message: this.message,
      metadata: this.metadata,
    });
  }
}

class OK extends SuccessResponse {
  constructor({ message, metadata = {} }) {
    super({ message, metadata });
  }
}
class CREATED extends SuccessResponse {
  constructor({
    options = {},
    message,
    statusCode = STATUS_CODE.CREATED,
    reasonStatusCode = ReasonStatusCode.CREATED,
    metadata = {},
  }) {
    super({ message, statusCode, reasonStatusCode, metadata });
    this.options = options;
  }
}
module.exports = {
  OK,
  CREATED,
  SuccessResponse
};