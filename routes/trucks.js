const express = require("express")
const {
    getAllTrucks,
    getTruckById,
    getTruckByCenterId,
    getTruckReadyToloadingByCenterId,
    addNewTruck,
    updateTruck,
    deleteTruck
} = require("../controllers/truckController")

const {
    verifyTokenAndAdmin,
    verifyAdminOrManager } = require("../middlewares/verifyToken")

const router = express.Router()


router.route("/")
    .get(verifyTokenAndAdmin ,getAllTrucks)
    .post(verifyAdminOrManager, addNewTruck)


router.route("/:id")
    .put(verifyAdminOrManager ,updateTruck)
    .delete(verifyAdminOrManager ,deleteTruck)

    router.get("/id/:id" , getTruckById )

    router.get("/centerId/:id" , getTruckByCenterId )

    router.get("/readytoloading/:id" , getTruckReadyToloadingByCenterId )

module.exports = router;