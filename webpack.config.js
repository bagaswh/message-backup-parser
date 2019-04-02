const path = require('path');

module.exports = {
  target: 'node',
  entry: './lib/index.ts',
  module: {
    rules: [{
      test: /\.tsx?$/,
      use: 'ts-loader',
      exclude: /node_modules/
    }]
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js']
  },
  output: {
    filename: 'index.js',
    path: path.resolve(__dirname, 'dist'),
    library: 'message-backup-parser',
    libraryTarget: 'umd',
    umdNamedDefine: true
  }
};