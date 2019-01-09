/**
 * 对象序列化
 * @param {Object} obj js普通对象
 * @returns {string} 序列化后的字符串
 */
export function serialize(obj) {
  let url = '';
  for (var k in obj) {
    let value = obj[k] !== undefined ? obj[k] : '';
    url += '&' + k + '=' + encodeURIComponent(value);
  }
  return url ? url.substring(1) : '';
}
