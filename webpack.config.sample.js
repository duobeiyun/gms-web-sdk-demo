const path = require('path')
const webpackMerge = require('webpack-merge')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const fs = require('fs')

const config = webpackMerge({
  mode: 'development',
  entry: {
    index: './sample/index.ts',
  },
  module: {
    rules: [
      {
        test: /(\.js(x?)$|\.ts(x?)$)/,
        exclude: [/node_modules/],
        use: [
          'babel-loader',
          {
            loader: 'ts-loader',
            options: {
              transpileOnly: true,
            },
          },
        ],
      },
    ],
  },
  output: {
    path: path.join(process.cwd(), './build/sample'),
    filename: '[name].js',
  },
  target: 'web',
  watch: true,
  plugins: [
    new HtmlWebpackPlugin({
      inject: true,
      template: './sample/index.html',
      filename: 'index.html',
    }),
  ],
  devtool: 'eval-source-map',
  devServer: {
    contentBase: path.join(__dirname, 'sample'),
    https: false,
    open: false,
    port: 9003,
  },
})

module.exports = config
