import { commonParams, REQ_STATE } from './config';
import { getUid } from 'assets/js/uid';
import axios from 'axios';

/**
 * 获取歌曲播放url
 * @param {Object} songs 歌曲列表
 * @returns {Promise} 歌曲信息
 */
export function getSongsUrl(songs) {
  const url = '/api/getPurlUrl';
  const mids = [];
  const types = [];

  songs.forEach((song) => {
    mids.push(song.mid);
    types.push(0);
  });

  const urlMid = {
    module: 'vkey.GetVkeyServer',
    method: 'CgiGetVkey',
    param: {
      guid: getUid(),
      songmid: mids,
      songtype: types,
      uin: '0',
      loginflag: 0,
      platform: '23'
    }
  };

  const data = Object.assign({}, commonParams, {
    format: 'json',
    platform: 'h5',
    needNewCode: 1,
    uin: 0
  });

  return axios.post(url, {
    comm: data,
    req_0: urlMid
  }).then(res => {
    if (res.data.code === REQ_STATE.OK) {
      const urlMid = res.data.req_0;
      if (urlMid && urlMid.code === REQ_STATE.OK) {
        const info = urlMid.data.midurlinfo[0];
        if (info && info.purl) {
          return urlMid.data.midurlinfo;
        }
      }
    }
    return false;
  });
}

/**
 * 获取歌词
 * @param {string} mid 歌曲mid
 * @returns {Promise} 歌词信息
 */
export function getLyric(mid) {
  const url ='/api/getLyric';

  const data = Object.assign({}, commonParams, {
    songmid: mid,
    platform: 'yqq',
    hostUin: 0,
    needNewCode: 0,
    categoryId: 10000000,
    pcachetime: +new Date(),
    format: 'json'
  });

  return axios.get(url, {
    params: data
  }).then(res => {
    return Promise.resolve(res.data);
  });
}