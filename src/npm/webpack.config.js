const path = require('path');

module.exports = {
  entry: './src/index.ts',
  mode: 'production',
  resolve: {
    extensions: ['.js', '.json', '.wasm', '.ts'],
    modules: ['node_modules', 'src'],
  },
  module: {
    rules: [
      {
        test: /.*\.ts$/,
        use: 'ts-loader',
      },
    ]
  },
  output: {
    library: 'happyblocks',
    filename: 'global.happyblocks.js',
    path: path.resolve(__dirname, 'dist'),
  },
};