const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin'); // 生成html
const VueLoaderPlugin = require('vue-loader/lib/plugin'); // vue-loader

const isDev = process.env.NODE_ENV === 'development';

const resolve = dir => {
  return path.join(__dirname, '..', dir);
};

const config = {
  entry: {
    app: [
      resolve('src/main.js')
    ]
  },
  output: {
    filename: '[name].[hash].js',
    path: resolve('dist'),
    publicPath: ''
  },
  resolve: {
    extensions: ['.js', '.vue'],
    alias: {
      'vue$': 'vue/dist/vue.esm.js',
      'assets': resolve('src/assets'),
      'coms': resolve('src/coms')
    }
  },
  module: {
    rules: [
      {
        enforce: 'pre',
        test: /\.(js|vue)$/,
        exclude: /node_modules/,
        include: resolve('src'),
        loader: 'eslint-loader'
      },
      {
        test: /\.vue$/,
        exclude: /node_modules/,
        include: resolve('src'),
        loader: 'vue-loader'
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        include: resolve('src'),
        loader: 'babel-loader'
      },
      {
        test: /\.(c|sc)ss$/,
        exclude: /node_modules/,
        use: [
          'vue-style-loader',
          {
            loader: 'css-loader',
            options: {
              sourceMap: true
            }
          },
          'postcss-loader',
          {
            loader: 'sass-loader',
            options: {
              sourceMap: true
            }
          },
          {
            loader: 'sass-resources-loader',
            options: {
              resources: resolve('src/assets/style/common.scss')
            }
          }
        ]
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: 'static/img/[name].[hash:7].[ext]' // 打包后存放路径
        }
      },
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: 'static/media/[name].[hash:7].[ext]'
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: 'static/font/[name].[hash:7].[ext]'
        }
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: resolve('public/index.html'),
      filename: 'index.html',
      minify: (isDev ? false : {
        minifyCSS: true,
        minifyJS: true,
        collapseWhitespace: true, // 节点空格
        removeComments: true, // 注释
        removeRedundantAttributes: true, // 多余的默认属性
        removeScriptTypeAttributes: true, // type="text/javascript"
        removeStyleLinkTypeAttributes: true, // style or link => type="text/css"
        useShortDoctype: true // Replaces the doctype with the short (HTML5) doctype
      })
    }),
    new VueLoaderPlugin()
  ]
};

module.exports = config;
