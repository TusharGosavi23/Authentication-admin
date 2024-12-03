import jwt from 'jsonwebtoken';

export const isLoggedin = (req, res, next) => {
  // Ensure Authorization header exists
  const token = req.header('Authorization')?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach the user data to the request object
    req.user = decoded.user;

    // Pass control to the next middleware or route handler
    next();
  } catch (err) {
    console.error('Token verification error:', err.message);
    res.status(401).json({ msg: 'Token is not valid' });
  }
};

// verifyToken middleware
export const verifyToken = (req, res, next) => {
  const token = req.header("Authorization")?.split(" ")[1];
  if (!token) return res.status(401).json({ msg: "Access denied. No token provided." });

  console.log('Token received:', token);
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ msg: "Token verification failed" });
    req.user = decoded.user;  // Attach decoded user to req.user
    next();  // Pass control to next middleware or route handler
  });
};

// isAdmin middleware
export const isAdmin = (req, res, next) => {
  // No need to verify token again here, it's already verified in the previous middleware
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ msg: "Access denied. User is not an admin." });
  }
  next();  // Proceed to the next handler (getAllUsers)
};
