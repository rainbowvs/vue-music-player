import * as types from './mutation-types';
import { playMode } from './config';
import { shuffle } from 'assets/js/utils';
import { saveSearch, deleteSearch, clearSearch } from 'assets/js/cache';

/**
 * 获取歌曲在列表中的索引
 * @param {Array} list 列表
 * @param {Object} song 歌曲
 */
const findIndex = (list, song) => {
  return list.findIndex(v => {
    return v.id === song.id;
  });
};

/**
 * 选中单曲播放
 * @param {Array} list 播放列表
 * @param {number} index 当前播放歌曲索引
 */
export const selectPlay = function({commit, state}, {list, index}) {
  let newIndex = index;
  commit(types.SET_SEQUENCE_LIST, list);
  if (state.mode === playMode.random) {
    // 随机播放模式
    const randomList = shuffle(list);
    commit(types.SET_PLAYLIST, randomList);
    newIndex = findIndex(randomList, list[index]);
  } else {
    commit(types.SET_PLAYLIST, list);
  }
  commit(types.SET_CURRENT_INDEX, newIndex);
  commit(types.SET_FULL_SCREEN, true);
  commit(types.SET_PLAYING_STATE, true);
};

/**
 * 随机播放
 * @param {Array} list 播放列表
 */
export const randomPlay = function({commit}, {list}) {
  commit(types.SET_PLAY_MODE, playMode.random);
  commit(types.SET_SEQUENCE_LIST, list);
  const randomList = shuffle(list);
  commit(types.SET_PLAYLIST, randomList);
  commit(types.SET_CURRENT_INDEX, 0);
  commit(types.SET_FULL_SCREEN, true);
  commit(types.SET_PLAYING_STATE, true);
};

/**
 * 插入歌曲
 * @param {Object} song 需插入的歌曲
 */
export const insertSong = function({commit, state}, song) {
  let playList = state.playList.slice();
  let sequenceList = state.sequenceList.slice();
  let currentIndex = state.currentIndex;
  let currentSong = playList[currentIndex];

  // 修改playList
  let fpIndex = findIndex(playList, song); // 原有歌曲位置
  currentIndex++;
  playList.splice(currentIndex, 0, song);
  if (fpIndex > -1) {
    // 当前播放列表已存在插入歌曲时，删除旧歌曲
    if(currentIndex > fpIndex) {
      // 插入位置在旧位置后面
      playList.splice(fpIndex, 1);
      currentIndex--;
    } else {
      playList.splice(fpIndex + 1, 1);
    }
  }

  // 修改sequenceList
  let currentSIndex = findIndex(sequenceList, currentSong) + 1;
  let fsIndex = findIndex(playList, song); // 原有歌曲位置
  sequenceList.splice(currentSIndex, 0, song);
  if (fsIndex > -1) {
    // 顺序播放列表已存在插入歌曲时，删除旧歌曲
    if (currentSIndex > fsIndex) {
      // 插入位置在旧位置后面
      sequenceList.splice(fsIndex, 0);
    } else {
      sequenceList.splice(fsIndex + 1, 0);
    }
  }

  commit(types.SET_PLAYLIST, playList);
  commit(types.SET_SEQUENCE_LIST, sequenceList);
  commit(types.SET_CURRENT_INDEX, currentIndex);
  commit(types.SET_FULL_SCREEN, true);
  commit(types.SET_PLAYING_STATE, true);
};

/**
 * 保存搜索历史
 * @param {string} query 搜索关键字
 */
export const saveSearchHistory = function({commit}, query) {
  commit(types.SET_SEARCH_HISTORY, saveSearch(query));
};

/**
 * 删除单个搜索历史
 * @param {string} query 搜索关键字
 */
export const deleteSearchHistory = function({commit}, query) {
  commit(types.SET_SEARCH_HISTORY, deleteSearch(query));
};

/**
 * 清空搜索历史
 */
export const clearSearchHistory = function({commit}) {
  commit(types.SET_SEARCH_HISTORY, clearSearch());
};
