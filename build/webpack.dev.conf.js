const webpack = require('webpack');
const webpackMerge = require('webpack-merge'); // 合并
const axios = require('axios');
const bodyParser = require('body-parser');
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
    before(app) {
      // 代理 /api/getCdInfo https://c.y.qq.com/qzone/fcg-bin/fcg_ucc_getcdinfo_byids_cp.fcg
      app.get('/api/getCdInfo', (req, res) => {
        const url = 'https://c.y.qq.com/qzone/fcg-bin/fcg_ucc_getcdinfo_byids_cp.fcg';
        axios.get(url, {
          headers: {
            referer: 'https://c.y.qq.com/',
            host: 'c.y.qq.com'
          },
          params: req.query
        }).then(response => {
          res.json(response.data);
        });
      });

      // 代理 /api/getDiscList，转发到 https://c.y.qq.com/splcloud/fcgi-bin/fcg_get_diss_by_tag.fcg
      app.get('/api/getDiscList', (req, res) => {
        const url = 'https://c.y.qq.com/splcloud/fcgi-bin/fcg_get_diss_by_tag.fcg';
        axios.get(url, {
          headers: {
            referer: 'https://c.y.qq.com/',
            host: 'c.y.qq.com'
          },
          params: req.query
        }).then(response => {
          res.json(response.data);
        });
      });

      // 代理 /api/getPurlUrl，转发到 https://u.y.qq.com/cgi-bin/musicu.fcg
      app.post('/api/getPurlUrl', bodyParser.json(), (req, res) => {
        const url = 'https://u.y.qq.com/cgi-bin/musicu.fcg';
        axios.post(url, req.body, {
          headers: {
            // 伪造源和引用，设置原接口Content-type
            referer: 'https://y.qq.com/',
            origin: 'https://y.qq.com',
            'Content-type': 'application/x-www-form-urlencoded'
          }
        }).then(response => {
          res.json(response.data);
        });
      });

      // 代理 /api/getLyric，转发到 https://c.y.qq.com/lyric/fcgi-bin/fcg_query_lyric_new.fcg
      app.get('/api/getLyric', (req, res) => {
        const url = 'https://c.y.qq.com/lyric/fcgi-bin/fcg_query_lyric_new.fcg';
        axios.get(url, {
          headers: {
            referer: 'https://c.y.qq.com/',
            host: 'c.y.qq.com'
          },
          params: req.query
        }).then(response => {
          res.json(response.data);
        });
      });
    },
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
