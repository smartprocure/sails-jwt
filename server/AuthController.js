let _ = require('lodash/fp')
let JWT = require('./JWT')
let {method} = require('sails-async')

module.exports = {
  login: (login, username='email', password='password', id='id') => method(async (req, res) => {
    let user = await login(req.param(username), req.param(password))
    if (user.error)
      return res.status(user.error || 401).send(user)
    let token = JWT.issue({
      user: user[id]
    })
    // Set here so client auto uses it
    res.set(JWT.renewTokenHeader, token);
    return {token}
  }),
  impersonate: (id='id') => method(async (req, res) => {
    let token = JWT.issue({
      // The new user will be whatever the target id is
      user: req.param(id),
      // Add the previous user to the back of the stack of users ids
      // Makes it easy to use with lodash :D
      impersonateStack: [...req.tokenPayload.impersonateStack || [], req.user.id]
    })
    res.set(JWT.renewTokenHeader, token)
    return {token}
  }),
  impersonatePop: method(async (req, res) => {
    let tokenRaw = {
      // Grab last user of the stack and make the new user
      user: _.last(req.tokenPayload.impersonateStack),
      // New stack should be the all but the last user
      // since they're the new user
      impersonateStack: _.initial(req.tokenPayload.impersonateStack)
    }
    let token = JWT.issue(tokenRaw)
    res.set(JWT.renewTokenHeader, token)
    return {token}
  }),
  verify: (fn, verify='verify', values='values') =>
    method(async req => fn(req.param('verify'), req.param('values')))
}
