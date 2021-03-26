const { ProvidePlugin } = require('webpack');
const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = merge(common, {
  mode: 'production',
  plugins: [
    new ProvidePlugin({
      process: 'process/browser',
      Buffer: ['buffer', 'Buffer']
    }),new HtmlWebpackPlugin({
      template: 'public/index.html',
    }),
  ],
});
