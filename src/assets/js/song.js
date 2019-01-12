export default class Song {
  constructor({id, mid, singer, name, album, duration, image, url}) {
    this.id = id;
    this.mid = mid;
    this.singer = singer;
    this.name = name;
    this.album = album;
    this.duration = duration;
    this.image = image;
    this.url = url;
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
    image: `https://y.gtimg.cn/music/photo_new/T002R300x300M000${albummid}.jpg?max_age=2592000`,
    url: `http://ws.stream.qqmusic.qq.com/${songid}.m4a?fromtag=46`
  });
}

/**
 * 提取歌手
 * @param {Array} singer 歌手
 * @returns {string} 1.歌手 2.歌手1/歌手2
 */
function filterSinger(singer) {
  if (!singer) {
    return '';
  }
  const ret = [];
  singer.forEach(s => ret.push(s.name));
  return ret.join('/');
}

