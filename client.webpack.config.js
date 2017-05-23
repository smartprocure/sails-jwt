var path = require('path')
var libraryName = require('./package.json').name

module.exports = {
  name: 'client',
  devtool: 'source-map',
  entry: path.join(__dirname, 'client/index.js'),
  output: {
    path: __dirname,
    filename: 'client.js',
    library: libraryName + 'Client',
    libraryTarget: 'umd'
  },
  module: {
    loaders: [{
      test: /(\.jsx|\.js)$/,
      loader: 'babel-loader',
      exclude: /(node_modules|bower_components)/
    }]
  },
  externals: {
    'lodash/fp': 'lodash/fp',
    'bluebird': 'bluebird',
    'moment': 'moment'
  }
}
