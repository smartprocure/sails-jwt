module.exports = require('include-all')({
  dirname: require('path').join(__dirname, 'server'),
  filter: /(.+)\.js$/,
  optional: true
})
