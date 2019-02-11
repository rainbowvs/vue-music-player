import jsonp from 'assets/js/jsonp';
import { commonParams, options } from './config';

/**
 * jsonp请求排行页的数据
 * @returns {Promise} promise
 */
export function requestTopList() {
  const url = 'https://c.y.qq.com/v8/fcg-bin/fcg_myqq_toplist.fcg';
  const data = Object.assign({}, commonParams, {
    platform: 'h5',
    uin: 0,
    needNewCode: 1
  });
  return jsonp(url, data, options);
}

/**
 * jsonp请求在排行页选中的歌单的数据
 * @param {number} topid 当前选中的歌单id
 * @returns {Promise} promise
 */
export function requestMusicList(topid) {
  const url = 'https://c.y.qq.com/v8/fcg-bin/fcg_v8_toplist_cp.fcg';
  const data = Object.assign({}, commonParams, {
    topid,
    needNewCode: 1,
    uin: 0,
    tpl: 3,
    page: 'detail',
    type: 'top',
    platform: 'h5'
  });
  return jsonp(url, data, options);
}
