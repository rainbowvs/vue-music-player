const path = require('path');
const webpackMerge = require('webpack-merge'); // 合并
const CleanWebpackPlugin = require('clean-webpack-plugin'); // 删除文件
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer'); // 拆包分析
const baseConfig = require('./webpack.config.js'); // 基础配置, 环境通用

const isAnalyzer = process.env.npm_config_report === 'true';
const resolve = dir => {
  return path.join(__dirname, '..', dir);
};

const config = webpackMerge(baseConfig, {
  mode: 'production',
  output: {
    filename: 'static/js/[name].[chunkhash].js' // chunkhash分块缓存
  },
  devtool: 'source-map',
  plugins: [
    new CleanWebpackPlugin(['dist'], {
      root: resolve('')
    }),
    ...(isAnalyzer ? [new BundleAnalyzerPlugin()] : [])
  ],
  optimization: {
    // 优化
    splitChunks: {
      // 代码分块
      cacheGroups: {
        // 缓存
        vendors: {
          // 打包引入的第三方库
          name: 'vendors',
          test: /node_modules/,
          chunks: 'initial' // 将入口文件分块
        }
      }
    },
    runtimeChunk: {
      // 运行文件
      name: 'manifest'
    }
  }
});

module.exports = config;
