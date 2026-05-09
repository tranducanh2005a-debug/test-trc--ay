const db = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// 🔐 SECRET
const ACCESS_SECRET = "secret";
const REFRESH_SECRET = "refresh_secret";

// ================= REGISTER =================
exports.register = (req, res) => {
  const { name, email, phone, password, role } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Thiếu dữ liệu" });
  }

  db.query(
    "SELECT * FROM users WHERE email = ?",
    [email],
    (err, result) => {
      if (err) return res.status(500).json(err);

      if (result.length > 0) {
        return res.status(400).json({ message: "Email đã tồn tại" });
      }

      const hash = bcrypt.hashSync(password, 10);

      db.query(
        "INSERT INTO users (name, email, phone, password, role) VALUES (?, ?, ?, ?, ?)",
        [name, email, phone, hash, role || "user"],
        (err) => {
          if (err) return res.status(500).json(err);

          res.json({ message: "Đăng ký thành công" });
        }
      );
    }
  );
};

// ================= LOGIN =================
exports.login = (req, res) => {
  const { email, password } = req.body;

  db.query(
    "SELECT * FROM users WHERE email = ?",
    [email],
    (err, result) => {
      if (err) return res.status(500).json(err);

      if (result.length === 0)
        return res.status(400).json({ message: "User not found" });

      const user = result[0];

      const isMatch = bcrypt.compareSync(password, user.password);
      if (!isMatch)
        return res.status(400).json({ message: "Wrong password" });

      // access token (ngắn hạn)
      const accessToken = jwt.sign(
        { id: user.id, role: user.role },
        ACCESS_SECRET,
        { expiresIn: "15m" }
      );

      // refresh token (dài hạn)
      const refreshToken = jwt.sign(
        { id: user.id, role: user.role },
        REFRESH_SECRET,
        { expiresIn: "7d" }
      );

      res.json({
        accessToken,
        refreshToken,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      });
    }
  );
};

// ================= REFRESH TOKEN =================
exports.refreshToken = (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(403).json({ message: "No refresh token" });
  }

  jwt.verify(refreshToken, REFRESH_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: "Invalid refresh token" });
    }

    const newAccessToken = jwt.sign(
      { id: user.id, role: user.role },
      ACCESS_SECRET,
      { expiresIn: "15m" }
    );

    res.json({ accessToken: newAccessToken });
  });
};
// ================= GET PROFILE =================
exports.getMe = (req, res) => {
  const userId = req.user.id;

  db.query(
    "SELECT id, name, email, phone, avatar FROM users WHERE id = ?",
    [userId],
    (err, result) => {
      if (err) return res.status(500).json(err);

      if (result.length === 0) {
        return res.status(404).json({ message: "User not found" });
      }

      res.json(result[0]);
    }
  );
};

// ================= UPDATE PROFILE =================
exports.updateProfile = (req, res) => {
  const userId = req.user.id;
  const { name } = req.body;

  // Có ảnh mới
  if (req.file) {
    const avatar = `http://192.168.1.12:5000/images/${req.file.filename}`;

    db.query(
      "UPDATE users SET name = ?, avatar = ? WHERE id = ?",
      [name, avatar, userId],
      (err) => {
        if (err) return res.status(500).json(err);

        return res.json({
          message: "Cập nhật thành công",
          avatar,
        });
      }
    );
  }

  // Không đổi ảnh
  else {
    db.query(
      "UPDATE users SET name = ? WHERE id = ?",
      [name, userId],
      (err) => {
        if (err) return res.status(500).json(err);

        return res.json({
          message: "Cập nhật thành công",
        });
      }
    );
  }
};