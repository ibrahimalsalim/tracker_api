const express = require("express")
const {
    getAllCenter,
    addNewCenter,
    updateCenter,
    deleteCenter
} = require("../controllers/centerController")

const {
    verifyTokenAndAdmin,
    verifyAdminOrManager } = require("../middlewares/verifyToken")

const router = express.Router()


router.route("/")
    .get(verifyAdminOrManager, getAllCenter)
    .post(verifyTokenAndAdmin, addNewCenter)


router.route("/:id")
    .put(verifyTokenAndAdmin, updateCenter)
    .delete(verifyTokenAndAdmin, deleteCenter)


module.exports = router;