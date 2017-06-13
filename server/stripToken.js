let JWT = require('./JWT')

module.exports = async (req, res, next) => {
  try {
    let token = JWT.getToken(req)
    await JWT.setTokenPayload(req, token)
    return next()
  } catch (e) {
    res.status(401).send({ message: e.message || e })
  }
}
