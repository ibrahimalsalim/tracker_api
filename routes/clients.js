const express = require("express");
const {
    addNewClient,
    updateClient,
    getAllClients,
    getClientById,
    getClientByNationalId,
    deleteClient,
} = require("../controllers/clientController");

const { verifyTokenAndAdmin,
    verifyAdminOrManager } = require("../middlewares/verifyToken")
const router = express.Router();

// /api/clients
router
    .get("/", verifyTokenAndAdmin, getAllClients)
    .post("/", verifyAdminOrManager, addNewClient)


// /api/clients/:id
router
    .route("/:id")
    .put(verifyAdminOrManager, updateClient)
    .delete(verifyTokenAndAdmin, deleteClient);
router
    .route("/id/:id")
    .get(verifyAdminOrManager, getClientById)
   
router
    .route("/nationalid/:nationalid")
    .get(verifyAdminOrManager, getClientByNationalId)
   


module.exports = router;
