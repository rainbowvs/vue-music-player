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

/**
 * 数值前补零
 * @param {number} num 需补零的数值
 * @param {number} [n=2] 补零后的位数
 * @returns {string} 补零后的字符串
 */
export function pad(num, n = 2) {
  let _num = num;
  let len = _num.toString().length;
  while (len < n) {
    _num = '0' + _num;
    len++;
  }
  return _num;
}

/**
 * 获取区间[min, max]的随机整数
 * @param {number} min 区间最小值
 * @param {number} max 区间最大值
 * @returns {number} 区间内随机整数
 */
export function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

/**
 * 数组洗牌
 * @param {Array} arr 需打散的数组
 * @returns {Array} 已打散的数组
 */
export function shuffle(arr) {
  const _arr = arr.slice();
  for (let i = 0, len = _arr.length; i < len; i++) {
    let j = getRandomInt(0, i);
    [_arr[i], _arr[j]] = [_arr[j], _arr[i]];
  }
  return _arr;
}

/**
 * 防抖
 * @param {Function} func 回调
 * @param {number} delay 延时
 * @returns {Function}
 */
export function debounce(func, delay) {
  let timer = null;
  return function (...args) {
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(() => {
      func && func.apply(this, args);
    }, delay);
  };
}
