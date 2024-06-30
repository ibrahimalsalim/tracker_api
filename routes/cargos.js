const express = require("express")
const {
    getAllCargos,
    getCargoById,
    getShipmentCargos,
    addNewCargo,
    updateCargo,
    deleteCargo
} = require("../controllers/cargoController")

const {
    verifyTokenAndAdmin,
    verifyAdminOrManager } = require("../middlewares/verifyToken")

const router = express.Router()


router.route("/")
    .get(verifyAdminOrManager, getAllCargos)
    .post(verifyTokenAndAdmin, addNewCargo)


router.route("/:id")
    .put(verifyTokenAndAdmin, updateCargo)
    .delete(verifyTokenAndAdmin, deleteCargo)

router.get("/id/:id" , getCargoById )
router.get("/shipmentcargo/:id" , getShipmentCargos )


module.exports = router;