var express = require('express');
var compression = require('compression');
var axios = require('axios');
const bodyParser = require('body-parser');

var port = process.env.PORT || 9999;

var app = express();

var apiRoutes = express.Router();


// 代理 /api/search，转发到 https://c.y.qq.com/soso/fcgi-bin/search_for_qq_cp
apiRoutes.get('/search', function (req, res) {
  const url = 'https://c.y.qq.com/soso/fcgi-bin/search_for_qq_cp';
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

// 代理 /api/getCdInfo，转发到 https://c.y.qq.com/qzone/fcg-bin/fcg_ucc_getcdinfo_byids_cp.fcg
apiRoutes.get('/getCdInfo', function (req, res) {
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
apiRoutes.get('/getDiscList', function (req, res) {
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
apiRoutes.get('/getLyric', function (req, res) {
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

app.use('/api', apiRoutes);

app.use(compression());

app.use(express.static('./dist'));

module.exports = app.listen(port, function (err) {
  if (err) {
    console.log(err);
    return;
  }
  console.log('Listening at http://localhost:' + port + '\n');
});
