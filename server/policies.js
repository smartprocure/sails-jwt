let f = require('futil-js')

module.exports = {
  impersonate: async (req, res, {id}) => {
    if (!id || !req.tokenPayload) f.throws(403)
    let currentUser = req.tokenPayload.user
    let sameUser = id === currentUser

    if (sameUser) f.throws({statusCode: 400, message: 'You cannot sign in as yourself!'})
  },
  impersonatePop: async (req, res) => {
    if (!req.user.isImpersonating) f.throws({statusCode: 400, message: 'You\'re not impersonating anyone!'})
  }
}
