const express = require("express")
const {
getShipmentStateByShipment,updateShipmentStateByShipment
} = require("../controllers/shipmentStateController")

const {
    verifyTokenAndAdmin,
    verifyAdminOrManager } = require("../middlewares/verifyToken")

const router = express.Router()


router.get("/:id", verifyAdminOrManager, getShipmentStateByShipment)

router.post("/", verifyAdminOrManager, updateShipmentStateByShipment)




module.exports = router;