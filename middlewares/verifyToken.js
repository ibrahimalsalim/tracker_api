const jwt = require("jsonwebtoken");

// Verify Token
function verifyToken(req, res, next) {
  const token = req.headers.token;
  if (token) {
    try {
      const decoded = jwt.verify(token, "process.env.JWT_SECRET_KEY");
      req.user = decoded;
      next();
    } catch (error) {
      res.status(401).json({ message: "invalid token" });
    }
  } else {
    res.status(401).json({ message: "no token provided" });
  }
}

// Verify Token & Authorize the user
function verifyTokenAndAuthorization(req, res, next) {
  verifyToken(req, res, () => {
    if (req.user.id == req.params.id || req.user.type == 1) {
      next();
    } else {
      return res.status(403).json({ message: "you are not allowed" });
    }
  });
}

function verifyTokenAndAdmin(req, res, next) {
  verifyToken(req, res, () => {
    if (req.user.type == 1) {
      next();
    } else {

      return res.status(403).json({ message: "you are not allowed,only admin allowed" });
    }
  });
}
function verifyTokenAndManager(req, res, next) {
  verifyToken(req, res, () => {
    if (req.user.type == 2) {
      next();
    } else {

      return res.status(403).json({ message: "you are not allowed,only manager allowed" });
    }
  });
}

function verifyAdminOrManager(req, res, next) {
  verifyToken(req, res, () => {
    if (req.user.type == 1 ||req.user.type == 2) {
      next();
    } else {

      return res.status(403).json({ message: "you are not allowed,only admin or manager allowed" });
    }
  });
}
function verifyTokenAndDriver(req, res, next) {
  verifyToken(req, res, () => {
    if (req.user.type == 3) {
      next();
    } else {

      return res.status(403).json({ message: "you are not allowed,only driver allowed" });
    }
  });
}

module.exports = {
  verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
  verifyTokenAndManager,
  verifyTokenAndDriver,
  verifyAdminOrManager
};
