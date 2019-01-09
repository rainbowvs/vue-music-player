const webpack = require('webpack');
const webpackMerge = require('webpack-merge'); // 合并
const baseConfig = require('./webpack.config.js'); // 基础配置, 环境通用

const getIPAdress = () => {
  const interfaces = require('os').networkInterfaces();
  for (const devName in interfaces) {
    const iface = interfaces[devName];
    for (let i = 0, len = iface.length; i < len; i += 1) {
      const alias = iface[i];
      if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal) {
        return alias.address;
      }
    }
  }
  return '0.0.0.0';
};

const config = webpackMerge(baseConfig, {
  mode: 'development',
  devtool: 'eval-source-map',
  devServer: {
    host: getIPAdress(),
    port: 8888,
    contentBase: false,
    hot: true,
    open: true,
    overlay: {
      errors: true
    }
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin() // HMR
  ]
});

module.exports = config;
