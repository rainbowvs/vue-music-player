import jsonp from 'assets/js/jsonp';
import { commonParams, options } from './config';

/**
 * jsonp请求歌手列表的数据
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

/**
 * jsonp请求指定id歌手详情的数据
 * @param {string} singerId 歌手id
 * @returns {Promise} promise
 */
export function requestSingerDetail(singerId) {
  const url = 'https://c.y.qq.com/v8/fcg-bin/fcg_v8_singer_track_cp.fcg';

  const data = Object.assign({}, commonParams, {
    hostUin: 0,
    needNewCode: 0,
    platform: 'yqq',
    order: 'listen',
    begin: 0,
    num: 80,
    songstatus: 1,
    singermid: singerId
  });
  return jsonp(url, data, options);
}
