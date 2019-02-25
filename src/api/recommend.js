import jsonp from 'assets/js/jsonp';
import axios from './axios';
import { commonParams, options, IS_DEV } from './config';

/**
 * jsonp请求推荐页的数据
 * @returns {Promise} promise
 */
export function requestRecommend() {
  const url = 'https://c.y.qq.com/musichall/fcgi-bin/fcg_yqqhomepagerecommend.fcg';
  const data = Object.assign({}, commonParams, {
    platform: 'h5',
    uin: 0,
    needNewCode: 1
  });
  return jsonp(url, data, options);
}

/**
 * 请求热门歌单列表数据
 * @returns {Promise} promise
 */
export function requestDiscList() {
  const url = IS_DEV ? '/api/getDiscList' : 'http://120.79.84.141/music/api/getDiscList';

  const data = Object.assign({}, commonParams, {
    platform: 'yqq',
    hostUin: 0,
    sin: 0,
    ein: 29,
    sortId: 5,
    needNewCode: 0,
    categoryId: 10000000,
    rnd: Math.random(),
    format: 'json'
  });

  return axios.get(url, {
    params: data
  }).then(res => {
    return Promise.resolve(res.data);
  });
}

/**
 * 请求指定歌单ID的歌曲列表数据
 * @param {number} disstid 歌单ID
 * @returns {Promise} promise
 */
export function requestSongList(disstid) {
  const url = IS_DEV ? '/api/getCdInfo' : 'http://120.79.84.141/music/api/getCdInfo';

  const data = Object.assign({}, commonParams, {
    disstid,
    type: 1,
    json: 1,
    utf8: 1,
    onlysong: 0,
    platform: 'yqq',
    hostUin: 0,
    needNewCode: 0,
    format: 'json'
  });

  return axios.get(url, {
    params: data
  }).then(res => {
    return Promise.resolve(res.data);
  });
}
