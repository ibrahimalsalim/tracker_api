const express = require("express")
const {
    getAllTrucks,
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


module.exports = router;