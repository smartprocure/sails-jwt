let _ = require('lodash/fp')
let Promise = require('bluebird')
let JWT = require('./JWT')
let set = _.set.convert({ immutable: false })
let bcrypt = Promise.promisifyAll(require('bcryptjs'))

const saltWorkFactor = 10

let callbackify = f => (...args) =>
  Promise.resolve(f(...args.slice(0, -1))).asCallback(_.last(args))

module.exports = (username = 'email', password = 'password') => {
  let checkPassword = async (record, passwordInput) =>
    bcrypt.compare(passwordInput, _.get(password, record))

  return {
    callbackify,
    checkPassword,
    async cleanRecord(values) {
      if (_.get(password, values))
        set(
          password,
          await bcrypt.hash(_.get(password, values), await bcrypt.genSalt(saltWorkFactor)),
          values
        )
      if (_.get(username, values))
        set(
          username,
          _.get(username, values).toLowerCase().trim(),
          values
        )
    },
    login: findOne => async (email, password) => {
      let auth = await findOne({ email: email.toLowerCase().trim() })
      if (!auth)
        return { error: 404, message: 'Incorrect email.' }
      let valid = await checkPassword(auth, password)
      if (!valid)
        return { error: 403, message: 'Invalid password.' }
      return auth
    },
    impersonate: findOne => async id => await findOne({ id }),
    generateVerifyToken: ({id, deltas}, options) => JWT.issue({
      id,
      exp: (new Date() / 1000) + (60 * 60 * 24 * 30), // 30 day expiration
      deltas
    }, options),
    verify: (findOne, update, verified='verified') => async (verify, values) => {
      let payload = await JWT.verify(verify)
      let {id} = await findOne({id: payload.id})
      // Changes from user
      let valuesToSet = _.extend({[verified]: true}, values)
      // Changes from token
      valuesToSet = _.extend(valuesToSet, payload.deltas)
      await update({id}, valuesToSet)
      return 204
    }
  }
}

// var {callbackify, cleanRecord, login} = require('sp-jwt').AuthModel()
// module.exports = {
//   attributes: {
//     email: { type: 'string' },
//     password: { type: 'string' },
//     firstName: { type: 'string' },
//     lastName: { type: 'string' },
//     verified: { type: 'boolean' },

//     group: {
//       model: 'groups'
//     },

//     login: () => login(sails.models.user.findOne),
//   },
//   afterCreate(values, callback) {
//     console.log('afterCreate values', values)
//     // TODO: send email here
//     callback()
//   },
//   beforeCreate: callbackify(cleanRecord),
//   beforeUpdate: callbackify(cleanRecord)
// }
