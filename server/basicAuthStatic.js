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

let getAuth = (url, auths) => url && f.reduceIndexed((memo, part) => find((val, key) => f.makeAndTest('i')(`^${part}$`)(key), memo) || memo['*'] || memo, auths, url.substr(1).split('/'))

module.exports = staticAuths => (req, res, next) => {
  let credentials = basicAuth(req)
  let auth = getAuth(req.originalUrl, f.callOrReturn(staticAuths))

  let result = (auth !== false) && ((auth === true) || (credentials && credentials.name === auth.username && credentials.pass === auth.password));
  if (result) next()
  else res.send(401, 'Basic Auth Failed')
}
