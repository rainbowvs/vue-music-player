<template>
  <transition name="slide">
    <div class="rank-detail">
      <music-list
        :rank="true"
        :title="title"
        :bg-image="bgImage"
        :songs="songs"
      ></music-list>
    </div>
  </transition>
</template>

<script>
  import { mapGetters } from 'vuex';
  import MusicList from 'coms/MusicList/MusicList';
  import { createSong, processSongsUrl } from 'assets/js/song';
  import { requestMusicList } from 'api/rank';
  import { REQ_STATE } from 'api/config';
  export default {
    data() {
      return {
        songs: []
      };
    },
    created() {
      this.getMusicList();
    },
    methods: {
      getMusicList() {
        if (!this.rank.id) {
          this.$router.push('/rank');
        }
        requestMusicList(this.rank.id).then(res => {
          if (res.code === REQ_STATE.OK) {
            processSongsUrl(this.normalizeSongs(res.songlist)).then(songs => {
              this.songs = songs;
            });
          }
        });
      },
      normalizeSongs(list) {
        let ret = [];
        list.forEach(v => {
          const { data } = v;
          if (data.songid && data.albummid) {
            ret.push(createSong(data));
          }
        });
        return ret;
      }
    },
    computed: {
      title() {
        return this.rank.topTitle;
      },
      bgImage() {
        if (this.songs.length) {
          // 数据获取成功时换成第一首歌的底图
          return this.songs[0].image;
        }
        return this.rank.picUrl;
      },
      ...mapGetters([
        'rank'
      ])
    },
    components: {
      MusicList
    }
  };
</script>


<style lang="scss" scoped>
  .slide-enter-active, .slide-leave-active {
    transition: all .3s;
  }
  .slide-enter, .slide-leave-to {
    transform: translate3d(100%, 0, 0);
  }
  .rank-detail {
    position: fixed;
    z-index: 2;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: $color-background;
  }
</style>
