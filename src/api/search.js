import jsonp from 'assets/js/jsonp';
import { commonParams, options } from './config';
import axios from 'axios';

/**
 * jsonp请求热门搜索词数据
 * @returns {Promise} promise
 */
export function requestHotKey() {
  const url = 'https://c.y.qq.com/splcloud/fcgi-bin/gethotkey.fcg';
  const data = Object.assign({}, commonParams, {
    uin: 0,
    needNewCode: 1,
    platform: 'h5'
  });
  return jsonp(url, data, options);
}

/**
 * 搜索
 * @param {string} query 搜索关键字
 * @param {number} page 请求页码
 * @param {Object} zhida 请求结果包含歌手信息
 * @param {number} perpage 单页数据条数
 * @returns {Promise} promise
 */
export function requestSearch(query, page, zhida, perpage) {
  const url = '/api/search';
  const data = Object.assign({}, commonParams, {
    w: query,
    p: page,
    perpage,
    n: perpage,
    catZhida: zhida ? 1 : 0,
    zhidaqu: 1,
    t: 0,
    flag: 1,
    ie: 'utf-8',
    sem: 1,
    aggr: 0,
    remoteplace: 'txt.mqq.all',
    uin: 0,
    needNewCode: 1,
    platform: 'h5',
    format: 'json'
  });
  return axios.get(url, {
    params: data
  }).then(res => {
    return Promise.resolve(res.data);
  });
}
