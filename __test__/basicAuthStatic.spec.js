const basicStaticAuth = require('../server/basicAuthStatic')

let staticAuths = {
  name: 'user',
  pass: 'pass',
  model: {
    '*': {
      name: 'user',
      pass: 'pass'
    },
    method: {
      name: 'user',
      pass: 'pass',
    }
  }
}

let basicAuth = basicStaticAuth(staticAuths)

// basic auth user/pass
let defaultCredentialBasicAuthHeader = 'Basic dXNlcjpwYXNz'

let checkAuth = (req, res, success, auth) => {
  basicAuth(req, res, success)
  expect(success).toHaveBeenCalled()
  expect(res.send).toHaveBeenCalledTimes(0)
  success.mockClear()
  res.send.mockClear()
  // check that invalid credentials fail
  auth.username = ''
  auth.password = ''
  basicAuth(req, res, success)
  expect(res.send).toHaveBeenCalledWith(401, 'Basic Auth Failed')
  expect(success).toHaveBeenCalledTimes(0)
  success.mockClear()
  res.send.mockClear()
}

it('Should Check Basic Auth', async () => {
  let req = {
    originalUrl: '/some/url',
    headers: {
      authorization: defaultCredentialBasicAuthHeader
    }
  }

  let res = {
    send: jest.fn()
  }

  let success = jest.fn()

  // Global user/pass auth
  checkAuth(req, res, success, staticAuths)
  // Controller basic auth
  req.originalUrl = '/model/test'
  checkAuth(req, res, success, staticAuths.model['*'])
  // Controller method basic auth
  req.originalUrl = '/model/method'
  checkAuth(req, res, success, staticAuths.model.method)
})
