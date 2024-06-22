const express = require("express")
const {
    getAllContentType,
    addNewContentType,
    updateContentType,
    deleteContentType
} = require("../controllers/contentTypeController")

const { verifyTokenAndAdmin,
    verifyAdminOrManager } = require("../middlewares/verifyToken")

const router = express.Router()


router.route("/")
    .get(verifyAdminOrManager, getAllContentType)
    .post(verifyTokenAndAdmin, addNewContentType)


router.route("/:id")
    .put(verifyTokenAndAdmin, updateContentType)
    .delete(verifyTokenAndAdmin, deleteContentType)


module.exports = router;