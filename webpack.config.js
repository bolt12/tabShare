const path = require('path');

module.exports = {
  entry: {
    popup: './src/normal_popup.js',
  },
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'src'),
  },
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /(node_modules)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
          },
        },
      },
    ],
  },
};
