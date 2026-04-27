const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    console.log("TOKEN:", req.headers.authorization); // ✅ PUT HERE

    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "agroshare_secret"
    );

    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
};