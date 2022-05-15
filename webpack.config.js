// Webpack uses this to work with directories
const path = require('path');

// This is the main configuration object.
module.exports = {
  // Path to your entry point. From this file Webpack will begin its work
  entry: './src/js/components/BarChart.js',

  // Path and filename of your result bundle.
  output: {
    path: path.resolve(__dirname, 'dist'),
    publicPath: '',
    filename: 'bundle.js',
  },

  // Default mode for Webpack is production
  mode: 'development',
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-modules'],
          },
        },
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
};
