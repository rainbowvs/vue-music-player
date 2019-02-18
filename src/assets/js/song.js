import { getSongsUrl, getLyric } from 'api/song';
import { REQ_STATE } from 'api/config';
import { Base64 } from 'js-base64';

export default class Song {
  constructor({id, mid, singer, name, album, duration, image, url = ''}) {
    this.id = id;
    this.mid = mid;
    this.singer = singer;
    this.name = name;
    this.album = album;
    this.duration = duration;
    this.image = image;
    this.url = url;
  }

  getLyric() {
    if (this.lyric) {
      // 当前歌曲已有歌词
      return Promise.resolve(this.lyric);
    }
    return new Promise((resolve, reject) => {
      getLyric(this.mid).then(res => {
        if (res.retcode === REQ_STATE.OK) {
          this.lyric = Base64.decode(res.lyric);
          resolve(this.lyric);
        } else {
          reject('no lyric');
        }
      });
    });
  }
}

export function createSong({songid, songmid, singer, songname, albumname, interval, albummid}) {
  return new Song({
    id: songid,
    mid: songmid,
    singer: filterSinger(singer),
    name: songname,
    album: albumname,
    duration: interval,
    image: `https://y.gtimg.cn/music/photo_new/T002R300x300M000${albummid}.jpg?max_age=2592000`
  });
}

/**
 * 提取歌手
 * @param {Array} singers 歌手
 * @returns {string} [歌手|歌手1/歌手2]
 */
function filterSinger(singers) {
  if (!singers) {
    return '';
  }
  const ret = [];
  singers.forEach(s => ret.push(s.name));
  return ret.join('/');
}

/**
 * 判断是否合法歌曲，过滤收费歌曲
 * @param {Object} musicData 请求返回的歌曲数据
 * @returns {boolean}
 */
export function isValidMusic(musicData) {
  return musicData.songid && musicData.albummid && (!musicData.pay || musicData.pay.payalbumprice === 0);
}

/**
 * 获取歌曲播放url，替代requestSinger接口的歌曲url无法播放
 * @param {Array} songs 不含url歌曲
 * @returns {Array} 包含url歌曲
 */
export function processSongsUrl(songs) {
  if (!songs.length) {
    return Promise.resolve(songs);
  }
  return getSongsUrl(songs).then(midUrlInfo => {
    midUrlInfo.forEach((v, i) => {
      songs[i].url = v.purl.indexOf('http') === -1
        ? `http://dl.stream.qqmusic.qq.com/${v.purl}`
        : v.purl;
    });
    return songs;
  });
}
