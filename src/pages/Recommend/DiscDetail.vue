<template>
  <transition name="slide">
    <div class="disc-detail">
      <music-list
        :title="title"
        :bg-image="bgImage"
        :songs="songs"
      >
      </music-list>
    </div>
  </transition>
</template>

<script>
  import MusicList from 'coms/MusicList/MusicList';
  import { requestSongList } from 'api/recommend';
  import { createSong, processSongsUrl } from 'assets/js/song';
  import { REQ_STATE } from 'api/config';
  import { mapGetters } from 'vuex';
  export default {
    data() {
      return {
        songs: []
      };
    },
    created() {
      this.getSongList();
    },
    methods: {
      getSongList() {
        if (!this.disc.dissid) {
          this.$router.push('/recommend');
          return;
        }
        requestSongList(this.disc.dissid).then(res => {
          if (res.code === REQ_STATE.OK) {
            processSongsUrl(this.normalizeSongs(res.cdlist[0].songlist)).then(songs => {
              this.songs = songs;
            });
          }
        });
      },
      normalizeSongs(list) {
        let ret = [];
        list.forEach(v => {
          if (v.songid && v.albummid) {
            ret.push(createSong(v));
          }
        });
        return ret;
      }
    },
    computed: {
      title() {
        return this.disc.dissname;
      },
      bgImage() {
        return this.disc.imgurl;
      },
      ...mapGetters([
        'disc'
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
  .disc-detail {
    position: fixed;
    z-index: 2;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: $color-background;
  }
</style>

