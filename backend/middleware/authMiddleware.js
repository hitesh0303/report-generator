const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const token = req.header('Authorization').replace('Bearer ', '');
  try {
    const decoded = jwt.verify(token, 'SECRET_KEY');
    req.userId = decoded.userId;
    next();
  } catch {
    res.status(401).json({ message: 'Unauthorized' });
  }
};
