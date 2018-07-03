module.exports = {
  entry: {
    app: ['babel-polyfill', './src/js/app.js']
  },
  output: {
    path: __dirname,
    filename: 'dist/index.js'
  },
  module: {
    loaders: [
      {
        test: /\.js?$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        query: {
          presets: ['env', 'stage-0']
        }
      }
    ]
  }
};
