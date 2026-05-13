import jwt from "jsonwebtoken";

export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = (authHeader && authHeader.split(" ")[1]) || req.query.token; // Support token in query for WebSocket connections
  if (!token) {
    return res.status(401).json({ error: "Access token missing" });
  }
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: "Invalid access token" });
    }
    req.user = user;
    next();
  });
};