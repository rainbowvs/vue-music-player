<template>
  <transition name="slide">
    <div class="user">
      <div class="back" @click="back">
        <i class="music-icon icon-back"></i>
      </div>
      <div class="tab-wrapper">
        <tab :tabs="tabs" :currentIndex="currentIndex" @change="changeTab" />
      </div>
      <div class="play-btn" @click="random">
        <i class="music-icon icon-play"></i>
        <span class="text">随机播放全部</span>
      </div>
      <div class="list-wrapper" ref="listWrapper">
        <scroll ref="favoriteList" class="list-scroll" v-if="currentIndex === 0" :dataList="favoriteList">
          <div class="list-inner">
            <song-list :songs="favoriteList" @select="selectSong"></song-list>
          </div>
        </scroll>
        <scroll ref="playList" class="list-scroll" v-if="currentIndex === 1" :dataList="playHistory">
          <div class="list-inner">
            <song-list :songs="playHistory" @select="selectSong"></song-list>
          </div>
        </scroll>
      </div>
      <div v-show="noResult" class="no-result-wrapper">
        <no-result :title="noResultTitle"></no-result>
      </div>
    </div>
  </transition>
</template>

<script>
  import { mapGetters, mapActions } from 'vuex';
  import Tab from 'coms/Player/Tab';
  import Scroll from 'coms/Scroll/Scroll';
  import SongList from 'coms/SongList/SongList';
  import NoResult from 'coms/NoResult/NoResult';
  import Song from 'assets/js/song';
  import { playListMixin } from 'assets/js/mixin';
  const docEl = document.documentElement;
  const { fontSize } = docEl.style;
  export default {
    mixins: [playListMixin],
    data() {
      return {
        currentIndex: 0,
        tabs: [
          {name: '我喜欢的'},
          {name: '最近听的'}
        ]
      };
    },
    methods: {
      handlePlayList(playList) {
        // mixin 解决miniPlayer占位bug
        const bottom = playList.length > 0 ? parseFloat(fontSize) * 1.2 : 0;
        this.$refs.listWrapper.style.bottom = `${bottom}px`;
        if (this.currentIndex === 0) {
          this.$refs.favoriteList.refresh();
        } else {
          this.$refs.playList.refresh();
        }
      },
      random() {
        let list = this.currentIndex === 0 ? this.favoriteList : this.playHistory;
        if (!list.length) {
          return;
        }
        list = list.map(v => {
          return new Song(v);
        });
        this.randomPlay({list});
      },
      selectSong(item) {
        // 因为存储localStorage经过序列化操作后实例对象被强转一般对象，因此需要重新实例化
        this.insertSong(new Song(item));
      },
      changeTab(index) {
        this.currentIndex = index;
      },
      back() {
        this.$router.back();
      },
      ...mapActions([
        'insertSong',
        'randomPlay'
      ])
    },
    computed: {
      noResultTitle() {
        if (this.currentIndex === 0) {
          return '暂无收藏歌曲';
        }
        return '您还没有听过歌曲';
      },
      noResult() {
        if (this.currentIndex === 0) {
          return !this.favoriteList.length;
        }
        return !this.playHistory.length;
      },
      ...mapGetters([
        'favoriteList',
        'playHistory'
      ])
    },
    components: {
      Tab,
      Scroll,
      SongList,
      NoResult
    }
  };
</script>

<style lang="scss" scoped>
  .user {
    position: fixed;
    top: 0;
    bottom: 0;
    z-index: 3;
    width: 100%;
    background: $color-background;
    &.slide-enter-active, &.slide-leave-active {
      transition: all 0.3s;
    }
    &.slide-enter, &.slide-leave-to {
      transform: translate3d(100%, 0, 0);
    }
    .back {
      position: absolute;
      top: 0;
      left: .12rem;
      z-index: 50;
      .icon-back {
        display: block;
        padding: .2rem;
        font-size: $font-size-large-x;
        color: $color-theme;
      }
    }
    .tab-wrapper {
      margin: .2rem 0 .6rem 0;
    }
    .play-btn {
      box-sizing: border-box;
      width: 2.7rem;
      padding: .14rem 0;
      margin: 0 auto;
      text-align: center;
      border: 1px solid  $color-text-l;
      color: $color-text-l;
      border-radius: 100px;
      font-size: 0;
      .icon-play {
        display: inline-block;
        vertical-align: middle;
        margin-right: .12rem;
        font-size: $font-size-medium-x;
      }
      .text {
        display: inline-block;
        vertical-align: middle;
        font-size: $font-size-small-x;
      }
    }
    .list-wrapper {
      position: absolute;
      top: 2.2rem;
      bottom: 0;
      width: 100%;
      .list-scroll {
        height: 100%;
        overflow: hidden;
        .list-inner {
          padding: .4rem .6rem;
        }
      }
    }
    .no-result-wrapper {
      position: absolute;
      width: 100%;
      top: 50%;
      transform: translateY(-50%);
    }
  }
</style>
