import _ from 'lodash/fp'

let storage = window.localStorage // eslint-disable-line

// Authentication
let options = {
  reAuthStates: /^(jwt (expired|malformed)|invalid token|concurrent login)|(No Authorization header was found)$/,
  handleJWTError: _.noop
}
options.checkError = (result, jwr) => (result.status === 'error' || jwr.error) && options.reAuthStates.test(result.message || result.error)

// Use local storage unless it is disabled
let token
let setToken = newToken => { storage ? storage.setItem('jwt', newToken) : token = newToken }
let getToken = () => storage ? storage.getItem('jwt') : token
let logout = () => setToken('')

// Usage:
// let addAuth = require('sp-jwt').addAuth
// let request = _.curryN(3, addAuth(transport))
let addAuth = f => async (method, url, params, includeJwr) => {
  if (_.isArray(params)) {
    throw new Error('Passing an array in the services will prevent auth from being added')
  }

  try {
    let [result, jwr] = await f(method, url, _.defaults({ token: getToken() }, params), true)
    if (options.checkError(result, jwr)) { options.handleJWTError(result, jwr) }

    var newToken = _.get(['headers', 'Renewed-Token'], jwr)
    if (newToken) { setToken(newToken) }

    return includeJwr ? [result, jwr] : result
  } catch(e) {
    if (options.checkError(e, {error:true})) options.handleJWTError(e)
    throw e
  }
}

export default {
  addAuth,
  options,
  setToken,
  getToken,
  logout
}
