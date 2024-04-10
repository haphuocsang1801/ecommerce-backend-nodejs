const { NOTIFICATIONS } = require("../utils/notification")

const notification = require("../models/notifications.model.js")
const notificationsModel = require("../models/notifications.model.js")
const { createPrivateKey } = require("crypto")

const pushNotiToSystem = async ({
	type = NOTIFICATIONS.NEW_PRODUCT,
	senderId = 1,
	recieverId = 1,
	options = {}
}) => {
	let content = ""
	switch (type) {
		case NOTIFICATIONS.NEW_PRODUCT:
			content = "@@@ has just added a new product @@@@"
			break
		case NOTIFICATIONS.ORDER_SUCCESS:
			content = "Order successfully"
			break
		default:
			break
	}
	const noti = await notification.create({
    noti_type: type,
    noti_senderId: senderId,
    noti_recieverId: recieverId,
    noti_content: content,
    noti_options: options,
  })
	return noti
}
const listNotiByUser = async ({
	userId = 1,
	type = 'ALL',
	isRead = 0
}) => {
	const match = {
		noti_recieverId: userId
	}
	if (type !== 'ALL') {
		match['noti_type'] = type
	}
	return await notificationsModel.aggregate([
    {
      $match: match,
    },
    {
      $project: {
        noti_type: 1,
        noti_senderId: 1,
        noti_content: 1,
        noti_recieverId: 1,
				createAt: 1,
				noti_options: 1,
      },
    },
  ])
}
module.exports = {
	pushNotiToSystem,
	listNotiByUser
}