const db = require("../config/db");

// lấy category dạng cây
exports.getCategories = (req, res) => {
  db.query("SELECT * FROM categories", (err, result) => {
    if (err) return res.status(500).json(err);

    // 👉 tách danh mục cha
    const parents = result.filter(
      (item) => item.parentId === null || item.parentId === 0
    );

    // 👉 build tree
    const data = parents.map((parent) => ({
      ...parent,
      children: result.filter((item) => item.parentId === parent.id),
    }));

    res.json(data);
  });
};