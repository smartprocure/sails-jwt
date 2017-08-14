const _ = require('lodash/fp')
const f = require('futil-js')
const find = _.find.convert({cap: false})
const basicAuth = require('basic-auth')

// Reads auths format from config:
// Example config:
// var localjs = {
//     staticAuths: {
//         username: 'defaultUser',
//         password: 'defaultPass',
//         controller:     { username: 'user', password: 'pass' },
//         controller2:    {
//             '*':            { username: 'user', password: 'pass' },
//             other:          { username: 'usr2', password: 'pas2' },
//             openMethod:     true,
//             lockedMethod:   false
//         }
//     }
// }

let urlParts = x => (x || '').substr(1).split('/')
let caselessEqual = (part, key) => f.makeAndTest('i')(`^${part}$`)(key)
let getAuth = (auths, url) =>
  f.reduce(
    (memo, part) =>
      find((x, key) => caselessEqual(part, key), memo) || memo['*'] || memo,
    auths,
    urlParts(url)
  )

module.exports = staticAuths => (req, res, next) => {
  let credentials = basicAuth(req)
  let auth = getAuth(req.originalUrl, f.callOrReturn(staticAuths))

  let result = _.isBoolean(auth) ? auth : _.isEqual(credentials, auth)

  if (result) next()
  else res.send(401, 'Basic Auth Failed')
}
