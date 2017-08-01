module.exports = {
  impersonate: async (req, res, {id}) => {
    if (!id || !req.tokenPayload) throw new Error('403 Forbidden')
    let currentUser = req.tokenPayload.user.id
    let sameUser = id === currentUser

    if (sameUser) throw new Error('400 Bad Request')
  },
  impersonatePop: async () => {
    if (!req.user.isImpersonating) throw new Error('400 Bad Request')
  }
}
