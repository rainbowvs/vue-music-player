import { playMode } from './config';

const state = {
  singer: {}, // 歌手
  playing: false, // 播放状态
  fullScreen: false, // 全屏播放状态
  playList: [], // 播放列表
  sequenceList: [], // 顺序播放列表
  mode: playMode.sequence, // 播放模式
  currentIndex: -1, // 当前播放歌曲索引
  disc: {} // 当前选中的热门歌单数据
};

export default state;
