let _ = require('lodash/fp')
let moment = require('moment')
let JWT = require('./JWT')

// SP
// let getModel = async (payload) => _.pick(['user', 'customer'], await Hydrate.userAccount(payload.user))
// let permissionsForUser = (id, customer) => _.find(customer.users, u => u.user.toString() === id).permissions
// let skipConcurrentLogins = async (req) =>
//   _.get('customer.data.accountType', req) === 'WhiteLabel'
//   || await sails.mongols.CustomerAccount.findOne({ _id: { $in: req.customer.ancestors }, 'data.accountType': 'WhiteLabel' })
//   ||  _.includes('concurrentLogin', permissionsForUser(req.customer, req.user.id))
// let getMostRecentLogin = async (user) => _.first((await user.activityLogs({ type: 'login' }, null, { limit: 1, sort: { timestamp: -1 } })).results)
// require('sp-jwt').isAuthenticated(getModel, getMostRecentLogin, skipConcurrentLogins)

// GQ
// require('sp-jwt').isAuthenticated(
//   async (payload) => ({ user: await sails.Models.User.findOne({ id: payload.user }) }),
//   _.get('lastLogin')
// )

// JWT iat is in seconds, so drop ms and accept 1s margin of error
let dropMS = timestamp => moment((Math.floor(timestamp / 1000) - 1) * 1000).valueOf()

module.exports = (getModel, getMostRecentLogin, skipConcurrentLogins = _.stubFalse) => async function (req, res, next) {
  try {
    // Add JWT payload to req
    JWT.setTokenPayload(req)

    // Add req.user, etc
    _.convert({ immutable: false }).extend(req, getModel(payload))

    // Check Concurrent Login
    let isNotImpersonation = _.isEmpty(req.tokenPayload.impersonateMode)
    if (isNotImpersonation && !(await skipConcurrentLogins(req))) {
      var tokenIssued = moment(JWT.decode(token).iat * 1000).valueOf()
      if (tokenIssued < dropMS(await getMostRecentLogin(req.user))) throw new Error('concurrent login')
    }

    // Refresh token
    // Need to omit `exp` and `iss` as of version 6 because they conflict with expires in and issuer passed in JWT
    res.set('Renewed-Token', JWT.issue(_.omit(['exp', 'iss'], req.tokenPayload)))

    next()
  } catch (e) {
    res.status(401).send({ message: e.message || e })
  }
}
