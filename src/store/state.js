import { playMode } from './config';
import { loadSearch, loadPlay } from 'assets/js/cache';

const state = {
  singer: {}, // 歌手
  playing: false, // 播放状态
  fullScreen: false, // 全屏播放状态
  playList: [], // 播放列表，随机时为乱序
  sequenceList: [], // 顺序播放列表，固定不变
  mode: playMode.sequence, // 播放模式
  currentIndex: -1, // 当前播放歌曲索引
  disc: {}, // 当前选中的热门歌单数据
  rank: {}, // 排行榜中选中的歌单
  searchHistory: loadSearch(), // 搜索历史，默认从localStorage读取
  playHistory: loadPlay() // 播放历史，默认从localStorage读取
};

export default state;
