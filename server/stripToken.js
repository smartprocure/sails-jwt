module.exports = async (req, res, next) => {
  delete req.query.token
  delete req.body.token
  return next()
}
