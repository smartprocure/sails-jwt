const _ = require('lodash/fp')
const reduce = _.reduce.convert({cap: false})
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

let getAuth = (url, auths) => {
  if (!url) return false

  let parts = url.substr(1).split('/');
  return reduce((memo, part) => {
    return find((val, key) => {
      return (new RegExp('^' + part + '$', 'i')).test(key);
    }, memo) || memo['*'] || memo;
  }, auths, parts)
}

module.exports = staticAuths => (req, res, next) => {
  let credentials = basicAuth(req)
  let auth = getAuth(req.originalUrl, staticAuths);

  let result = (auth !== false) && ((auth === true) || (credentials && credentials.name === auth.username && credentials.pass === auth.password));
  if (result)
    next();
  else
    res.send(401, 'Basic Auth Failed');
}
