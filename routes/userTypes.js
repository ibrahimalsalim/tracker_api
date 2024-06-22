const express = require("express")
const {
    getAllUserTypes,
    addNewUserType,
    updateUserType,
    deleteUserType
} = require("../controllers/userTypeController")


const router = express.Router()


router.route("/")
    .get(getAllUserTypes)
    .post(addNewUserType)


router.route("/:id")
    .put(updateUserType)
    .delete(deleteUserType)


module.exports = router;