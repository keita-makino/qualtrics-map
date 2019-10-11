const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer')
  .BundleAnalyzerPlugin;
const CompressionPlugin = require('compression-webpack-plugin');

module.exports = {
  entry: './src/index.tsx',
  module: {
    rules: [
      {
        test: /\.(ts|js)x?$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      }
    ]
  },
  resolve: { extensions: ['.ts', '.tsx', '.js', '.jsx'] },
  plugins: [
    new CompressionPlugin({
      algorithm: 'gzip',
      filename: '[path].gz[query]',
      test: /\.(ts|js)x?$/,
      compressionOptions: {
        level: 9
      }
    })
  ],
  output: {
    path: path.resolve(__dirname, 'dist/'),
    filename: 'bundle.js'
  },
  node: {
    fs: 'empty',
    net: 'empty',
    tls: 'empty'
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'public/index.html'
    }),
    new BundleAnalyzerPlugin()
  ]
};
