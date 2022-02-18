const path = require('path');

module.exports = {
  entry: './src/main.js',
  mode: 'development',
  output: {
    filename: 'custom-sonos-card.js',
    path: path.resolve(__dirname),
    libraryTarget: 'umd',
  },
  optimization: {
    minimize: true,
  },
};
