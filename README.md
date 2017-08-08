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

### Instantiate and assign in your policies.js configuration

```javascript
let basicAuthStatic = require('sails-jwt/server/basicAuthStatic')({
    username: 'defaultUser',
    password: 'defaultPassword',
    controller: {
        username: 'controllerUser',
        password: 'controllerPassword'
    },
    controller2: {
        '*': {
            username: 'controller2User',
            password: 'controller2Password',
            method: {
                username: 'methodUser',
                password: 'methodPassword'
            },
            openMethod:     true,
            lockedMethod:   false
        }
    }
})
```

## License

Too young to get a license 🚗
