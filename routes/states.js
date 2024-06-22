const express = require("express")
const {
    getAllStates,
    addNewState,
    updateState,
    deleteState
} = require("../controllers/stateController")
const router = express.Router()

const {
    verifyTokenAndAdmin,
    verifyAdminOrManager } = require("../middlewares/verifyToken")

router.route("/")
    .get(verifyAdminOrManager, getAllStates)
    .post(verifyTokenAndAdmin, addNewState)


router.route("/:id")
    .put(verifyTokenAndAdmin, updateState)
    .delete(verifyTokenAndAdmin, deleteState)


module.exports = router;