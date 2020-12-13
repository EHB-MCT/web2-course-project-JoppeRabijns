const jwt = require('jsonwebtoken');

const authenticate = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decode = jwt.verify(token, '$&dkY6');

    req.user = decode;
    next();
  } catch (error) {
    res.json({
      message: "error occured"
    })
  }
}

module.exports = authenticate;