const db = require("../config/db");

// 🔥 GET CART
exports.getCart = (req, res) => {
  const userId = req.user.id;

  const sql = `
    SELECT cart.id, cart.quantity, cart.size,
       products.name, products.price, products.image
    FROM cart 
    JOIN products ON cart.product_id = products.id
    WHERE cart.user_id = ?
  `;

  db.query(sql, [userId], (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result);
  });
};

// 🔥 ADD TO CART
exports.addToCart = (req, res) => {
  const userId = req.user.id;
  const { product_id, size } = req.body;

  db.query(
    "SELECT * FROM cart WHERE user_id=? AND product_id=? AND size=?",
    [userId, product_id, size],
    (err, result) => {
      if (err) return res.status(500).json(err);

      if (result.length > 0) {
        db.query(
          "UPDATE cart SET quantity = quantity + 1 WHERE id=?",
          [result[0].id],
          (err2) => {
            if (err2) return res.status(500).json(err2);
            res.json({ message: "Updated quantity" });
          }
        );
      } else {
        db.query(
          "INSERT INTO cart (user_id, product_id, size, quantity) VALUES (?, ?, ?, 1)",
          [userId, product_id, size],
          (err3) => {
            if (err3) return res.status(500).json(err3);
            res.json({ message: "Added to cart" });
          }
        );
      }
    }
  );
};

// 🔥 UPDATE
exports.updateCart = (req, res) => {
  const { id, quantity } = req.body;

  db.query(
    "UPDATE cart SET quantity=? WHERE id=?",
    [quantity, id],
    (err) => {
      if (err) return res.status(500).json(err);
      res.json({ message: "Updated" });
    }
  );
};

// 🔥 DELETE
exports.deleteCart = (req, res) => {
  const { id } = req.params;

  db.query("DELETE FROM cart WHERE id=?", [id], (err) => {
    if (err) return res.status(500).json(err);
    res.json({ message: "Deleted" });
  });
};