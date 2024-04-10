const { Schema, model, Types } = require("mongoose")
const { NOTIFICATIONS } = require("../utils/notification")

const DOCUMENT_NAME = "Notification"
const COLLECTION_NAME = "Notifications"

//ORDER-001: Order successfully
//ORDER-002: Order failed
//PROMOTION-001: new PROMOTION
//SHOP-001:new product by User Shop

const notificationSchema = new Schema(
  {
    noti_type: {
      type: String,
      enum: [
        NOTIFICATIONS.ORDER_SUCCESS,
        NOTIFICATIONS.ORDER_FAILED,
        NOTIFICATIONS.PROMOTION,
        NOTIFICATIONS.NEW_PRODUCT,
      ],
      required: true,
    },
    noti_senderId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Shop",
    },
    noti_recieverId: {
      type: Number,
      required: true,
    },
    noti_content: {
      type: String,
      required: true,
    },
    noti_options: {
      type: Object,
      default: {},
    },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
)

module.exports = model(DOCUMENT_NAME, notificationSchema)