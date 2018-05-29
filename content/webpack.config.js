const path = require('path');
const webpack = require('webpack');

module.exports = {

  entry: [
    './content/src/scripts/index.js'
  ],

  output: {
    filename: 'main.js',
    path: path.join(__dirname, '../', 'build'),
    publicPath: '/'
  },
  plugins: [new webpack.optimize.UglifyJsPlugin()],
  resolve: {
    extensions: ['.js', '.jsx', '.scss', '.json'],
    modules: ['node_modules']
  },

  module: {
    loaders: [
      {
        test: /\.(jsx|js)?$/,
        loader: 'babel-loader',
        exclude: /(node_modules)/,
        include: path.join(__dirname, 'src'),
        query: {
          presets: ['es2015', 'react', 'stage-1']
        }
      }
    ]
  }
};
