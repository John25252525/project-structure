require('dotenv/config');

const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const jsLoaders = require('./loaders/js-loaders');
const cssLoaders = require('./loaders/css-loaders');
const fontLoaders = require('./loaders/font-loaders');
const imageLoaders = require('./loaders/image-loaders');
const tsLoaders = require('./loaders/ts-loaders');

module.exports = {
  target: 'web',
  entry: {
    app: path.join(__dirname, '../src/index.ts'),
    styles: path.join(__dirname, '../src/styles/all.css')
  },
  output: {
    publicPath: '/',
    filename: '[name].bundle.js',
    path: path.join(__dirname, '../dist'),
    chunkFilename: '[name]-[id].js'
  },
  module: {
    rules: [
      {
        test: /\.(ts|js)x?$/,
        use: tsLoaders,
        exclude: /node_modules/
      },
      {
        test: /\.js?$/,
        use: 'source-map-loader'
      },
      {
        test: /\.(png|jpe?g|gif|svg)$/i,
        use: imageLoaders
      },
      {
        // | svg - add in case when we need load svg font
        test: /\.(woff|woff2|ttf|eot)(\?v=\d+\.\d+\.\d+)?$/,
        use: fontLoaders
      },
      {
        test: /\.css$/i,
        use: cssLoaders
      },
      {
        test: /\.(js)?$/,
        use: jsLoaders,
        exclude: [/(node_modules)/]
      }
    ]
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.jsx', '.js'],
    extensionAlias: {
      '.js': ['.js', '.ts']
    }
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
      'process.env.IMGUR_CLIENT_ID': JSON.stringify(process.env.IMGUR_CLIENT_ID),
      'process.env.BACKEND_URL': JSON.stringify(process.env.BACKEND_URL),
      'process.env.IMGUR_URL': JSON.stringify(process.env.IMGUR_URL)
    }),
    new HtmlWebpackPlugin({
      template: path.join(__dirname, '../src/index.html')
    }),
    new MiniCssExtractPlugin({
      // Options similar to the same options in webpackOptions.output
      // both options are optional
      filename: '[name].css',
      chunkFilename: '[id].css'
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: path.join(__dirname, '../src/assets'),
          to: 'assets/[path][name][ext]',
          noErrorOnMissing: true
        },
        {
          from: path.join(__dirname, '../src/components/product-form/*.svg'),
          to: '[name][ext]',
          noErrorOnMissing: true
        }
      ]
    })
  ]
};
