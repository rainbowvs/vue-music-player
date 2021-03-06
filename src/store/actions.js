import * as types from './mutation-types';
import { playMode } from './config';
import { shuffle } from 'assets/js/utils';
import {
  saveSearch,
  deleteSearch,
  clearSearch,
  savePlay,
  saveFavorite,
  deleteFavorite
} from 'assets/js/cache';

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
    newIndex = findIndex(randomList, list[index]);
    commit(types.SET_PLAYLIST, randomList);
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
  const currentSong = playList[currentIndex];

  // 修改playList
  const fpIndex = findIndex(playList, song); // 原有歌曲位置
  currentIndex++; // 在当前播放歌曲的下一位插入
  playList.splice(currentIndex, 0, song); // 插入歌曲
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
  const currentSIndex = findIndex(sequenceList, currentSong) + 1;
  const fsIndex = findIndex(sequenceList, song); // 原有歌曲位置
  sequenceList.splice(currentSIndex, 0, song); // 插入歌曲
  if (fsIndex > -1) {
    // 顺序播放列表已存在插入歌曲时，删除旧歌曲
    if (currentSIndex > fsIndex) {
      // 插入位置在旧位置后面
      sequenceList.splice(fsIndex, 1);
    } else {
      sequenceList.splice(fsIndex + 1, 1);
    }
  }

  commit(types.SET_PLAYLIST, playList);
  commit(types.SET_SEQUENCE_LIST, sequenceList);
  commit(types.SET_CURRENT_INDEX, currentIndex);
  commit(types.SET_FULL_SCREEN, true);
  commit(types.SET_PLAYING_STATE, true);
};

 /**
 * 删除一首播放列表中的歌曲
 * @param {Object} song 需要删除的歌曲
 */
export const deleteSong = function({commit, state}, song) {
  let playList = state.playList.slice();
  let sequenceList = state.sequenceList.slice();
  let currentIndex = state.currentIndex;
  const pIndex = findIndex(playList, song);
  playList.splice(pIndex, 1);
  const sIndex = findIndex(sequenceList, song);
  sequenceList.splice(sIndex, 1);

  if (currentIndex > pIndex || currentIndex === playList.length) {
    // 删除位置在当前正在播放歌曲位置前面 或 删除的是最后一首歌(currentIndex重置为-1)
    currentIndex--;
  }
  commit(types.SET_PLAYLIST, playList);
  commit(types.SET_SEQUENCE_LIST, sequenceList);
  commit(types.SET_CURRENT_INDEX, currentIndex);

  if (!playList.length) {
    commit(types.SET_PLAYING_STATE, false);
  } else {
    commit(types.SET_PLAYING_STATE, true);
  }
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

/**
 * 清空播放歌曲列表
 */
export const clearSongList = function({commit}) {
  commit(types.SET_PLAYLIST, []);
  commit(types.SET_SEQUENCE_LIST, []);
  commit(types.SET_CURRENT_INDEX, -1);
  commit(types.SET_PLAYING_STATE, false);
};

/**
 * 保存播放历史
 * @param {Object} song 被插入播放历史的歌曲
 */
export const savePlayHistory = function({commit}, song) {
  commit(types.SET_PLAY_HISTORY, savePlay(song));
};

/**
 * 保存收藏列表
 * @param {Object} song 被插入收藏列表的歌曲
 */
export const saveFavoriteList = function({commit}, song) {
  commit(types.SET_FAVORITE_LIST, saveFavorite(song));
};

/**
 * 删除单个收藏歌曲
 * @param {Object} song 指定歌曲
 */
export const deleteFavoriteList = function({commit}, song) {
  commit(types.SET_FAVORITE_LIST, deleteFavorite(song));
};
