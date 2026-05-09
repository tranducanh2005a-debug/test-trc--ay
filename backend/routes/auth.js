const router = require("express").Router();

const {
  register,
  login,
  refreshToken,
  getMe,
  updateProfile,
} = require("../controllers/authController");

const upload = require("../middleware/upload");
const verifyToken = require("../middleware/authMiddleware");

// ===== AUTH =====
router.post("/register", register);
router.post("/login", login);
router.post("/refresh", refreshToken);

// ===== PROFILE =====
router.get("/me", verifyToken, getMe);
router.put("/update", verifyToken, upload.single("avatar"), updateProfile);

module.exports = router;