import storage from 'good-storage';

const SEARCH_KEY = '__search__'; // 搜索历史key
const SEARCH_MAX_LENGTH = 15; // 搜索历史列表最大长度

const PLAY_KEY = '__play__'; // 播放历史key
const PLAY_MAX_LENGTH = 200; // 播放历史列表最大长度

/**
 * 数组头部插入元素，元素超出maxLen个时删除第一个元素
 * @param {Array} arr 数组
 * @param {string} val 插入元素
 * @param {Function} compare 比较函数回调
 * @param {number} maxLen 数组最大长度
 */
function insertArray(arr, val, compare, maxLen) {
  const index = arr.findIndex(compare);
  if (index === 0) {
    return;
  } else if (index > 0) {
    arr.splice(index, 1);
  }
  arr.unshift(val);
  if (maxLen && arr.length > maxLen) {
    arr.pop();
  }
}

/**
 * 从数组中删除指定元素
 * @param {Array} arr 数组
 * @param {string} val 删除元素
 * @param {Function} compare 比较函数回调
 */
function delectFromArray(arr, val, compare) {
  const index = arr.findIndex(compare);
  if (index > -1) {
    arr.splice(index, 1);
  }
}

/**
 * 保存搜索历史，同时存储在localStorage和Vuex中
 * @param {string} query 搜索关键字
 * @returns {Array} 新搜索历史
 */
export function saveSearch(query) {
  let searches = storage.get(SEARCH_KEY, []);
  insertArray(searches, query, v => {
    return v === query;
  }, SEARCH_MAX_LENGTH);
  storage.set(SEARCH_KEY, searches);
  return searches;
}

/**
 * 从localStorage读取搜索历史
 * @returns {Array} 搜索历史
 */
export function loadSearch() {
  return storage.get(SEARCH_KEY, []);
}

/**
 * 删除单条指定搜索历史
 * @param {string} query 搜索关键字
 * @returns {Array} 新搜索历史
 */
export function deleteSearch(query) {
  let searches = storage.get(SEARCH_KEY, []);
  delectFromArray(searches, query, v => {
    return v === query;
  });
  storage.set(SEARCH_KEY, searches);
  return searches;
}

/**
 * 清空搜索历史
 * @returns {Array} 空数组
 */
export function clearSearch() {
  storage.remove(SEARCH_KEY);
  return [];
}

/**
 * 添加指定播放历史
 * @param {Object} song 新增歌曲
 * @returns {Array} 新播放历史
 */
export function savePlay(song) {
  let songs = storage.get(PLAY_KEY, []);
  insertArray(songs, song, v => {
    return v.id === song.id;
  }, PLAY_MAX_LENGTH);
  storage.set(PLAY_KEY, songs);
  return songs;
}

/**
 * 从localStorage读取播放历史
 * @returns {Array} 播放历史
 */
export function loadPlay() {
  return storage.get(PLAY_KEY, []);
}
