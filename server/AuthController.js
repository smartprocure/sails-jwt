let JWT = require('./JWT')

module.exports = {
  login: (login, username='email', password='password', id='id') => async (req, res) => {
    let user = await login(req.param(username), req.param(password))
    if (user.error)
      return res.status(user.error || 401).send(user)
    let token = JWT.issue({
      user: user[id]
    })
    // Set here so client auto uses it
    res.set(JWT.renewTokenHeader, token);
    res.status(200).send({ token })
  },
  verify: (fn, verify='verify', values='values') =>
    async req => fn(req.param('verify'), req.param('values'))
}