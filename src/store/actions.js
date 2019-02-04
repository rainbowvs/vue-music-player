import * as types from './mutation-types';
import { playMode } from './config';
import { shuffle } from 'assets/js/utils';

/**
 * 选中单曲播放
 * @param {Array} list 播放列表
 * @param {number} index 当前播放歌曲索引
 */
export const selectPlay = function({commit, state}, {list, index}) {
  commit(types.SET_SEQUENCE_LIST, list);
  if (state.mode === playMode.random) {
    // 随机播放模式
    const randomList = shuffle(list);
    commit(types.SET_PLAYLIST, randomList);
    index = randomList.findIndex(v => {
      return list[index].id === v.id;
    });
  } else {
    commit(types.SET_PLAYLIST, list);
  }
  commit(types.SET_CURRENT_INDEX, index);
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
