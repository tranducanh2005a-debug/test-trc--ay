const db = require("../config/db");

// ===== GET ORDERS =====
exports.getOrders = (req, res) => {
  const userId = req.user.id;

  db.query(
    "SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC",
    [userId],
    (err, orders) => {
      if (err) return res.status(500).json(err);

      res.json(orders);
    }
  );
};

// ===== CREATE ORDER =====
exports.createOrder = (req, res) => {
  try {
    const userId = req.user.id;

    const {
      items,
      address,
      phone,
      total,
      payment,
      shipping,
    } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: "Giỏ hàng trống" });
    }

    if (!address || !phone) {
      return res.status(400).json({ message: "Thiếu thông tin" });
    }

    db.query(
      "INSERT INTO orders (user_id, address, phone, total, payment, shipping) VALUES (?, ?, ?, ?, ?, ?)",
      [userId, address, phone, total, payment, shipping],
      (err, orderResult) => {
        if (err) {
          console.log("ORDER ERROR:", err);
          return res.status(500).json({ message: "Lỗi server" });
        }

        const orderId = orderResult.insertId;

        let completed = 0;

        items.forEach((item) => {
          db.query(
            "INSERT INTO order_items (order_id, product_id, quantity, size) VALUES (?, ?, ?, ?)",
            [
              orderId,
              item.productId,
              item.quantity,
              item.size,
            ],
            (err) => {
              if (err) {
                console.log("ITEM ERROR:", err);
                return res.status(500).json({ message: "Lỗi server" });
              }

              completed++;

              if (completed === items.length) {
                res.json({
                  message: "Đặt hàng thành công",
                  orderId,
                });
              }
            }
          );
        });
      }
    );
  } catch (err) {
    console.log("CRASH:", err);
    res.status(500).json({ message: "Lỗi server" });
  }
};