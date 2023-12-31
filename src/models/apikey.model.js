const { model, Schema, Types } = require("mongoose");

const DOCUMENT_NAME = "ApiKey";
const COLLECTION_NAME = "Apikeys";

const apiKeySchema = new Schema(
  {
    key: {
      type: String,
      required: true,
      unique: true,
    },
    status: {
      type: Boolean,
      default: "active",
    },
    permissions: {
      type: [String],
      required: true,
      enum: ["0000", "1111", "2222"],
    },
  },
  {
    collection: COLLECTION_NAME,
    timestamps: true,
  }
);
module.exports = model(DOCUMENT_NAME, apiKeySchema);
