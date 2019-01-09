import originJsonp from 'jsonp';
import { serialize } from './utils';

/**
 * promise 封装 jsonp
 * @param {string} url 请求地址
 * @param {Object} data 请求参数
 * @param {Object} option 请求配置
 * @returns {Promise} promise
 */
export default function jsonp(url, data, option) {
  url += (url.indexOf('?') < 0 ? '?' : '&') + serialize(data);
  return new Promise((resolve, reject) => {
    originJsonp(url, option, (err, data) => {
      if (!err) {
        return resolve(data);
      }
      return reject(err);
    });
  });
}
