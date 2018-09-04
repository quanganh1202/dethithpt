import jwt from 'jsonwebtoken';

const secret = process.env.JWT_SECRET || 'SUPERSECRET_KEY';
const tokenGenerator = function generateToken(sign) {
  const expiresIn = parseInt(process.env.JWT_EXPRIRE_TIME || '60') * 60 * 1000; // Minutes
  let token;
  if (secret && !isNaN(expiresIn)) {
    token = jwt.sign({
      data: sign,
    }, secret, { expiresIn });
  }

  return {
    token,
    expiresIn,
  };
};

const headerExtractor = function extractHeader(req) {
  const token = req.headers['x-access-token'] || req.headers['x-token'];

  return token;
};

const tokenVerifier = function verifyToken(req, res, next) {
  // Ignore authenticate with GET request
  if (req.method.toUpperCase() === 'GET') next();
  else {
    const token = headerExtractor(req);
    if (token && jwt.verify(token, secret)) {
      const { data } = jwt.decode(token);
      req.app.locals.id = data.id;
      next();
    } else {
      res.status(401).json({
        error: 'Unauthorized',
      });
    }
  }
};

export { tokenGenerator, tokenVerifier };