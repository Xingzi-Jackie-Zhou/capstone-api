import jwt from "jsonwebtoken"; // Assuming you're using JWT for token authentication

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (token == null) return res.sendStatus(401); // If no token, return 401

  jwt.verify(token, process.env.SECRET_KEY, (err, user) => {
    if (err) return res.sendStatus(403); // If token invalid, return 403
    req.user = user;
    next();
  });
};

export default authenticateToken;
