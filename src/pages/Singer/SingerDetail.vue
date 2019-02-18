<template>
  <transition name="slide">
    <div class="singer-detail">
      <music-list
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
  import { requestSingerDetail } from 'api/singer';
  import { REQ_STATE } from 'api/config';
  import { createSong, processSongsUrl, isValidMusic } from 'assets/js/song';
  export default {
    data() {
      return {
        songs: []
      };
    },
    mounted() {
      this.getSingerDetail(this.singer.id);
    },
    methods: {
      getSingerDetail(singerId) {
        if (!singerId) {
          this.$router.push({
            name: 'Singer'
          });
          return;
        }
        requestSingerDetail(singerId).then(res => {
          if (res.code === REQ_STATE.OK) {
            processSongsUrl(this.normalizeSongs(res.data.list)).then(songs => {
              this.songs = songs;
            });
          }
        });
      },
      normalizeSongs(list) {
        const ret = [];
        list.forEach(v => {
          const { musicData } = v;
          if (isValidMusic(musicData)) {
            ret.push(createSong(musicData));
          }
        });
        return ret;
      }
    },
    computed: {
      title() {
        return this.singer.name;
      },
      bgImage() {
        return this.singer.avatar;
      },
      ...mapGetters([
        'singer'
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
  .singer-detail {
    position: fixed;
    z-index: 2;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: $color-background;
  }
</style>
