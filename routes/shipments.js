const express = require("express")
const {
    getAllShipments,
    getShipmentById,
    getShipmentByCenterId,
    sentShipmentByCenterId,
    receivedShipmentByCenterId,
    loadingShipmentByCenterId,
    addNewShipment,
    updateShipment,
    deleteShipment
} = require("../controllers/shipmentController")

const {
    verifyTokenAndAdmin,
    verifyAdminOrManager } = require("../middlewares/verifyToken")

const router = express.Router()


router.route("/")
    .get(verifyTokenAndAdmin, getAllShipments)
    .post(verifyAdminOrManager, addNewShipment)


router.route("/:id")
    .put(verifyAdminOrManager, updateShipment)
    .delete(verifyAdminOrManager, deleteShipment)

router.get("/id/:id", getShipmentById)

router.get("/centerId/:id", getShipmentByCenterId)
router.get("/sentshipmentbycenterid/:id", sentShipmentByCenterId)
router.get("/receivedshipmentbycenterid/:id", receivedShipmentByCenterId)
router.get("/loadingshipmentbycenterid/:id", loadingShipmentByCenterId)

module.exports = router;