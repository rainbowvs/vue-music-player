import * as types from './mutation-types';

const mutations = {
  /**
   * 设置歌手
   * @param {Object} singer 歌手
   */
  [types.SET_SINGER](state, singer) {
    state.singer = singer;
  },
  /**
   * 设置播放状态
   * @param {boolean} flag 播放状态
   */
  [types.SET_PLAYING_STATE](state, flag) {
    state.playing = flag;
  },
  /**
   * 设置全屏播放
   * @param {boolean} flag 全屏播放
   */
  [types.SET_FULL_SCREEN](state, flag) {
    state.fullScreen = flag;
  },
  /**
   * 设置播放列表
   * @param {Array} list 播放列表
   */
  [types.SET_PLAYLIST](state, list) {
    state.playList = list;
  },
  /**
   * 设置顺序播放列表
   * @param {Array} list 顺序播放列表
   */
  [types.SET_SEQUENCE_LIST](state, list) {
    state.sequenceList = list;
  },
  /**
   * 设置播放模式
   * @param {number} mode 播放模式
   */
  [types.SET_PLAY_MODE](state, mode) {
    state.mode = mode;
  },
  /**
   * 设置当前播放歌曲索引
   * @param {number} index 当前播放歌曲索引
   */
  [types.SET_CURRENT_INDEX](state, index) {
    state.currentIndex = index;
  },
  /**
   * 设置当前选中的热门歌单数据
   * @param {Object} disc 当前选中的热门歌单数据
   */
  [types.SET_DISC](state, disc) {
    state.disc = disc;
  },
  /**
   * 设置排行榜中选中的歌单
   * @param {Object} rank 排行榜中选中的歌单
   */
  [types.SET_RANK](state, rank) {
    state.rank = rank;
  },
  /**
   * 设置搜索历史列表
   * @param {Array} history 搜索历史列表
   */
  [types.SET_SEARCH_HISTORY](state, history) {
    state.searchHistory = history;
  },
  /**
   * 设置播放历史列表
   * @param {Array} history 播放历史列表
   */
  [types.SET_PLAY_HISTORY](state, history) {
    state.playHistory = history;
  },
  /**
   * 设置收藏列表
   * @param {Array} list 收藏列表
   */
  [types.SET_FAVORITE_LIST](state, list) {
    state.favoriteList = list;
  }
};

export default mutations;
