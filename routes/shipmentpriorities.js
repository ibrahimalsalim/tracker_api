const express = require("express")
const {
    getAllShipmentPriority,
    addNewShipmentPriority,
    updateShipmentPriority,
    deleteShipmentPriority
} = require("../controllers/shipmentPriorityController")

const { verifyTokenAndAdmin,
    verifyAdminOrManager } = require("../middlewares/verifyToken")

const router = express.Router()


router.route("/")
    .get(verifyAdminOrManager, getAllShipmentPriority)
    .post(verifyTokenAndAdmin, addNewShipmentPriority)


router.route("/:id")
    .put(verifyTokenAndAdmin, updateShipmentPriority)
    .delete(verifyTokenAndAdmin, deleteShipmentPriority)


module.exports = router;