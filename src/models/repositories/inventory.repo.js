const inventoryModel = require("../inventory.model")
const { Types } = require("mongoose")
const insertInventory = async ({
  productId,
  shopId,
  stock,
  location = "unknow",
}) => {
  return await inventoryModel.create({
    inven_productId: productId,
    inven_shopId: shopId,
    location,
    inven_stock: stock,
  })
}

module.exports = {
  insertInventory,
}
