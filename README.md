[![CircleCI](https://circleci.com/gh/smartprocure/sails-jwt.svg?style=svg)](https://circleci.com/gh/smartprocure/sails-jwt)

# sails-jwt
SmartProcure's JWT NPM package - the best, least-opinionated JWT package for managing users in sailsjs.

Because all other JWT packages are not so good, at best.
We're sorry (not really).

## DISCLAIMER

This repository is under heavy development. By no means use this in
production, unless you know what you're doing.

## Dependencies

You must have available: `lodash`, `bluebird`, `moment` and `jsonwebtoken`.

## How to use this

### To secure your user model

```javascript
let { callbackify, cleanRecord, checkPassword } = require('sp-jwt/server').AuthModel()
module.exports = {
  attributes: {
    email: { type: 'string' },
    password: { type: 'string' },
    firstName: { type: 'string' },
    lastName: { type: 'string' },
    verified: { type: 'boolean' },

    group: {
      model: 'groups'
    },

    checkPassword
  },
  afterCreate(values, callback) {
    console.log('afterCreate values', values)
    // TODO: send email here
    callback()
  },
  beforeCreate: callbackify(cleanRecord),
  beforeUpdate: callbackify(cleanRecord)
}
```

### How to use it in your client

Add the authentication to your current transport layer.

```javascript
let addAuth = require('sp-jwt/client').addAuth
let request = _.curryN(3, addAuth(transport))
```

## Basic auth policy setup

This policy can be used to configure sails.js endpoints to allow support for basic auth authentication
through http authorization header in the request

### Instantiate and assign in your policies.js configuration

```javascript
// ... sails policies.js configuration

let basicAuthStatic = require('sails-jwt/server/basicAuthStatic')({
    username: 'defaultUser',
    password: 'defaultPassword',
    BasicAuthController: {
        username: 'controllerUser',
        password: 'controllerPassword'
    },
    BasicAuthMethodController: {
        '*': {
            username: 'controller2User',
            password: 'controller2Password'
        },
        basicAuthMethod: {
            username: 'methodUser',
            password: 'methodPassword'
        },
        openMethod:     true,
        lockedMethod:   false
    }
})

module.exports.policies = {
    // will enforce the default user/pass for all endpoints on this controller
    SomeController: {
        '*': basicAuthStatic
    },
    // will enforce the BasicAuthController user/pass override for all endpoints on this controller
    BasicAuthController: {
        '*': basicAuthStatic
    },
    // will enforce the BasicAuthMethodController "*" user/pass for all endpoints on this controller
    // except the basicAuthMethod which will require the overriding user/pass combo from the configuration for that controller's method
    BasicAuthMethodController: {
        '*': basicAuthStatic
    }
}
```

## License

Too young to get a license 🚗
