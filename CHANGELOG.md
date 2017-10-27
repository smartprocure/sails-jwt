# 1.4.8
Making sure `login` throws the error message instead of just the
status code if there's a message.

# 1.4.7
Bug fix for `login` which was calling to res.send even though it was a
wrapped in a sails-async method.

 # 1.4.6
Bug fix for `stripToken` which wasn't stripping the token if you pass an empty string

# 1.4.5
Always run Duti in Circle

# 1.4.4
Able to pass a Function or Object as configuration for Basic Auth

# 1.4.3
Move __test__ to root folder

# 1.4.2
Updated readme

# 1.4.1
Add duti to the repo

# 1.4.0
Add basic auth policy

# 1.3.0
Add opt-in impersonation policies

# 1.2.0
Add support for impersonation.

# 1.1.2
Switch from `async` to `Promise` methods to avoid regenerator runtime issues.

# 1.1.1
Making sure generateVerifyToken works after the changes on JWT.issue.

# 1.1.0
Fixed bug in the issue function. Now it actually refreshes the token.

# 1.0.11
Properly await for the results of getModel

# 1.0.10
Enforce lowercased email values in the AuthModel.login method

# 1.0.9
If there's an exception, only handle JWT errors if the exception
message is a known error.

# 1.0.8
If there's an exception, after handling the error as part of JWT, we
should delegate the error so it is usable elsewhere.

# 1.0.7
If there is an exception it should call handle error.

# 1.0.6
Explicitly passing the token to setTokenPayload.

# 1.0.5
Declaring the JWT object in JWT.js

# 1.0.4
Use `babel-preset-latest` for browser compatibility.
