let JWT = require('./JWT')

module.exports = async (req, res, next) => {
  try {
    JWT.setTokenPayload(req)
    return next()
  } catch (e) {
    res.status(401).send({ message: e.message || e })
  }
}
