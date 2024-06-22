const express = require("express");
const { register, login } = require("../controllers/authController");
const { verifyTokenAndAdmin } = require("../middlewares/verifyToken")
const router = express.Router();


// /api/auth/register
router.post("/register", verifyTokenAndAdmin, register);

// /api/auth/login
router.post("/login", login);

module.exports = router;


