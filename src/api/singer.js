import jsonp from 'assets/js/jsonp';
import { commonParams, options } from './config';

/**
 * jsonp请求歌手页的数据
 * @returns {Promise} promise
 */
export function requestSinger() {
  const url = 'https://c.y.qq.com/v8/fcg-bin/v8.fcg';
  const data = Object.assign({}, commonParams, {
    channel: 'singer',
    page: 'list',
    key: 'all_all_all',
    pagesize: 100,
    pagenum: 1,
    hostUin: 0,
    needNewCode: 0,
    platform: 'yqq'
  });
  return jsonp(url, data, options);
}
