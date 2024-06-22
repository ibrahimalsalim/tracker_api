const express = require("express")
const {
    getAllUserTypes,
    addNewUserType,
    updateUserType,
    deleteUserType
} = require("../controllers/userTypeController")

const { verifyTokenAndAdmin } = require("../middlewares/verifyToken")

const router = express.Router()


router.route("/")
    .get(verifyTokenAndAdmin, getAllUserTypes)
    .post(verifyTokenAndAdmin, addNewUserType)


router.route("/:id")
    .put(verifyTokenAndAdmin, updateUserType)
    .delete(verifyTokenAndAdmin, deleteUserType)


module.exports = router;