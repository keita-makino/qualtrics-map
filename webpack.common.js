const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
  entry: './src/index.tsx',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
    fallback: {
      fs: false,
      net: false,
      tls: false,
      assert: require.resolve('assert/'),
      https: require.resolve('https-browserify'),
      crypto: require.resolve('crypto-browserify'),
      buffer: require.resolve('buffer/'),
      http: require.resolve('stream-http'),
      stream: require.resolve('stream-browserify'),
      os: require.resolve('os-browserify/browser'),
      zlib: require.resolve('browserify-zlib'),
      path: require.resolve('path-browserify'),
    },
  },
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        extractComments: false,
      }),
    ],
  },
};
