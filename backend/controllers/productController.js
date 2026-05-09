const db = require("../config/db");

exports.getProducts = (req, res) => {
  const { categoryId, keyword } = req.query;

  let sql = "SELECT * FROM products WHERE 1=1";
  let params = [];

  if (categoryId) {
    sql += " AND category_id = ?";
    params.push(categoryId);
  }

  if (keyword) {
    // ép so sánh theo collation bỏ dấu
    sql += " AND name COLLATE utf8mb4_unicode_ci LIKE ?";
    params.push(`%${keyword}%`);
  }

  db.query(sql, params, (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result);
  });
};