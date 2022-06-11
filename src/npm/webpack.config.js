const path = require('path');

module.exports = {
  entry: './src/index.js',
  mode: 'production',
  output: {
    library: 'happyblocks',
    filename: 'global.happyblocks.js',
    path: path.resolve(__dirname, 'dist'),
  },
};