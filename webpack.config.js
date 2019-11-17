'use strict'
 
const path = require('path')
 
const resolve = dir => path.join(__dirname, '.', dir)
 
const isProd = process.env.NODE_ENV === 'production'
 
module.exports = {
  entry: {
    imagesDownloader: './index.js'
  },
  output: {
    path: resolve('dist'), // 输出目录
    filename: '[name].js', // 输出文件
    libraryTarget: 'umd', // 采用通用模块定义
    library: 'imagesDownloader', // 库名称
    publicPath: '/assets/'
  },
  devtool: '#source-map',
  devServer: {
    contentBase: './test'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /(node_modules)/
      }
    ]
  },
  plugins: [
  ]
}
