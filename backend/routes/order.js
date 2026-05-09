const express = require("express");
const router = express.Router();

const {
  createOrder,
  getOrders,
} = require("../controllers/orderController");

const verifyToken = require("../middleware/authMiddleware");

// ===== ROUTES =====

// 🔥 tạo đơn hàng
router.post("/", verifyToken, createOrder);

// 🔥 lấy lịch sử đơn
router.get("/", verifyToken, getOrders);

module.exports = router;