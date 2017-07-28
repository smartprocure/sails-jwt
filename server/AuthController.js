let _ = require('lodash/fp')
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
  impersonate: (grabUser, id='id') => async (req, res) => {
    try {
      let currentId = req.user.id
      let targetId = req.param(id)
      let newStack = _.concat(currentId)(req.tokenPayload.impersonateStack || [])
      let token = JWT.issue({
        // The new user will be whatever the target id is
        user: targetId,
        // Add the previous user to the back of the stack of users ids
        // Makes it easy to use with lodash :D
        impersonateStack: newStack
      })
      res.set(JWT.renewTokenHeader, token)
      res.status(200).send({token})
    } catch (e) {
      // Return 500 because there was a problem with the server
      // Either grabbing permissions failed (developer's fault)
      // Or generating a token failed (server's fault)
      res.status(500).send({message: e.message || e})
    }
  },
  impersonatePop: async (req, res) => {
    try {
      let tokenRaw = {
        // Grab last user of the stack and make the new user
        user: _.last(req.tokenPayload.impersonateStack),
        // New stack should be the all but the last user
        // since they're the new user
        impersonateStack: _.dropRight(1)(req.tokenPayload.impersonateStack)
      }
      // _.dropRight will still return an empty array if it dropped all users
      if (_.isEmpty(tokenRaw.impersonateStack)) delete tokenRaw.impersonateStack
      let token = JWT.issue(tokenRaw)
      res.set(JWT.renewTokenHeader, token)
      res.status(200).send({token})
    } catch(e) {
      res.status(500).send({ message: e.message || e })
    }
  },
  verify: (fn, verify='verify', values='values') =>
    async req => fn(req.param('verify'), req.param('values'))
}