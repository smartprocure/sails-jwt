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
