module.exports = {
  impersonate: async (req, res, {id}) => {
    if (!id || !req.tokenPayload) throw {statusCode: 403}
    let currentUser = req.tokenPayload.user.id
    let sameUser = id === currentUser

    if (sameUser) throw {statusCode: 400}
  },
  impersonatePop: async () => {
    if (!req.user.isImpersonating) throw {statusCode: 400}
  }
}
