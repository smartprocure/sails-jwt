let _ = require('lodash/fp')
let Promise = require('bluebird')
let jwt = require('jsonwebtoken')

// e.g.
// require('sp-jwt').JWT.secret = sails.jwt.secret
// require('sp-jwt').JWT.defaults = sails.jwt.defaults

let JWT = {
  secret: 'Change Me',
  expiresIn: 60 * 60 * 2,
  defaults: {
    issuer: 'myapp'
  },
  renewTokenHeader: 'Renewed-Token',
  issue (payload, settings = {}) {
    let exp = Math.floor(Date.now() / 1000) + JWT.expiresIn
    return jwt.sign(_.defaults({exp}, payload), JWT.secret, _.defaults(JWT.defaults, settings))
  },
  verify (token) {
    return Promise.promisify(jwt.verify)(token, JWT.secret, JWT.defaults)
  },
  // Reference http://thesabbir.com/how-to-use-json-web-token-authentication-with-sails-js/
  // Implementation is the same as passport jwt library to get jwt token
  getToken (req) {
    if (req.headers && req.headers.authorization) {
      var parts = req.headers.authorization.split(' ')
      if (parts.length === 2 && /^Bearer$/i.test(parts[0])) { return parts[1] }
      throw new Error('Format is Authorization: Bearer [token]')
    } else if (req.body.hasOwnProperty('token')) {
      var token = req.param('token')
      // Delete the token to not mess with blueprints (could be in body for POST or query for GET)
      delete req.query.token
      delete req.body.token
      return token
    }
    throw new Error('No Authorization header was found')
  },
  async setTokenPayload(req, token) {
    // Add JWT payload to req
    let payload = await JWT.verify(token)
    req.tokenPayload = payload
    req.impersonateStack = payload.impersonateStack || []
    req.userStack = [payload.user].concat(req.impersonateStack)
  },
  decode: jwt.decode
}

module.exports = JWT
