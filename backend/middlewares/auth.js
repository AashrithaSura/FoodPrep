const jwt = require('jsonwebtoken');

const authMiddleware = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Token is missing or malformed" });
    }

    const token = authHeader.split(" ")[1]; // Get the actual token

    try {
        const decoded = jwt.verify(token, process.env.JWT_TOKEN_SECRET);
        req.userId = decoded.id;
        next();
    } catch (error) {
        console.error("JWT verification failed:", error.message);
        res.status(401).json({ message: "Token is invalid" });
    }
};

module.exports = authMiddleware;
