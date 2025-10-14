// /server/middleware/authMiddleware.js

const jwt = require('jsonwebtoken');

const protect = (req, res, next) => {
  let token;

  // 1. Check if the 'Authorization' header exists and starts with 'Bearer'
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // 2. Get the token from the header (e.g., "Bearer eyJhbGci...")
      // We split the string by the space and take the second part.
      token = req.headers.authorization.split(' ')[1];

      // 3. Verify the token using our JWT_SECRET
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // 4. Attach the decoded user payload to the request object
      // This allows future route handlers to know who the user is (e.g., req.user.id)
      req.user = decoded;
      
      // 5. If everything is successful, call next() to proceed to the next middleware or route handler
      next();

    } catch (error) {
      // If the token is invalid (e.g., expired, wrong secret), an error will be thrown
      res.status(401).json({ error: 'Not authorized, token failed' });
    }
  }

  // If there's no token in the header at all
  if (!token) {
    res.status(401).json({ error: 'Not authorized, no token' });
  }
};

module.exports = { protect };