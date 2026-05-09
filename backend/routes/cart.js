const express = require("express");
const router = express.Router();

const cartController = require("../controllers/cartController");
const auth = require("../middleware/authMiddleware");

router.get("/", auth, cartController.getCart);
router.post("/", auth, cartController.addToCart);
router.put("/", auth, cartController.updateCart);
router.delete("/:id", auth, cartController.deleteCart);

module.exports = router;