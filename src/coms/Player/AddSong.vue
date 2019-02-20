<template>
  <transition name="slide">
    <div class="add-song" v-show="showFlag">
      <div class="header">
        <h2 class="title">添加歌曲到列表</h2>
        <div class="close" @click="hide">
          <i class="music-icon icon-close"></i>
        </div>
      </div>
      <div class="search-box-wrapper">
        <search-box ref="searchBox" @query="onQueryChange" placeholder="搜索歌曲"></search-box>
      </div>
      <div class="shortcut" v-show="!query">
        <tab :tabs="tabs" :currentIndex="currentIndex" @change="changeTab" />
        <div class="list-wrapper">
          <scroll ref="songList" class="list-scroll" v-if="currentIndex === 0" :dataList="playHistory">
            <div class="list-inner">
              <song-list :songs="playHistory" @select="selectSong"></song-list>
            </div>
          </scroll>
          <scroll ref="searchList" class="list-scroll" v-if="currentIndex === 1" :dataList="playHistory">
            <div class="list-inner">
              <search-list
                :searches="searchHistory"
                @select="addQuery"
                @delete="deleteSearchHistory"
              />
            </div>
          </scroll>
        </div>
      </div>
      <div class="search-result" v-show="query">
        <suggest
          ref="suggest"
          :query="query"
          :showSinger="showSinger"
          @listBeforeScroll="blurInput"
          @select="selectSearchItem"
        ></suggest>
      </div>
      <top-tip ref="topTip">
        <div class="tip-title">
          <i class="music-icon icon-ok"></i>
          <span class="text">1首歌曲已经添加到播放列表</span>
        </div>
      </top-tip>
    </div>
  </transition>
</template>

<script>
  import { mapGetters, mapActions } from 'vuex';
  import Scroll from 'coms/Scroll/Scroll';
  import SearchBox from 'coms/SearchBox/SearchBox';
  import Suggest from 'coms/Suggest/Suggest';
  import SongList from 'coms/SongList/SongList';
  import SearchList from 'coms/SearchList/SearchList';
  import Tab from './Tab';
  import TopTip from 'coms/TopTip/TopTip';
  import { searchMixin } from 'assets/js/mixin';
  import Song from 'assets/js/song';
  export default {
    mixins: [searchMixin],
    data() {
      return {
        showFlag: false,
        showSinger: false,
        currentIndex: 0,
        tabs: [
          {name: '最近播放'},
          {name: '搜索历史'}
        ]
      };
    },
    methods: {
      selectSearchItem() {
        this.saveSearchHistory(this.query);
        this.showTopTip();
      },
      showTopTip() {
        this.$refs.topTip.show();
      },
      refreshScrollList() {
        this.$nextTick(() => {
          if (this.currentIndex === 0) {
            this.$refs.songList.refresh();
          } else {
            this.$refs.searchList.refresh();
          }
        });
      },
      selectSong(item, index) {
        if (index !== 0) {
          // 除了第一首歌
          // 因为存储localStorage经过序列化操作后实例对象被强转一般对象，因此需要重新实例化
          this.insertSong(new Song(item));
          this.showTopTip();
        }
      },
      changeTab(index) {
        this.currentIndex = index;
        this.refreshScrollList();
      },
      show() {
        this.showFlag = true;
        this.refreshScrollList();
      },
      hide() {
        this.showFlag = false;
      },
      ...mapActions([
        'insertSong'
      ])
    },
    computed: {
      ...mapGetters([
        'searchHistory',
        'playHistory'
      ])
    },
    watch: {
      query(newVal) {
        if (!newVal) {
          this.refreshScrollList();
        }
        this.$nextTick(() => {
          this.$refs.suggest.refresh();
        });
      }
    },
    components: {
      SearchBox,
      Suggest,
      Tab,
      Scroll,
      SongList,
      SearchList,
      TopTip
    }
  };
</script>

<style lang="scss" scoped>
  .add-song {
    position: fixed;
    top: 0;
    bottom: 0;
    width: 100%;
    z-index: 200;
    background: $color-background;
    &.slide-enter-active, &.slide-leave-active {
      transition: all 0.3s;
    }
    &.slide-enter, &.slide-leave-to {
      transform: translate3d(100%, 0, 0);
    }
    .header {
      position: relative;
      height: .88rem;
      text-align: center;
      .title {
        margin: 0;
        font-weight: normal;
        line-height: .88rem;
        font-size: $font-size-large;
        color: $color-text;
      }
      .close {
        position: absolute;
        top: 0;
        right: .16rem;
        .icon-close {
          display: block;
          padding: .24rem;
          font-size: .4rem;
          color: $color-theme;
        }
      }
    }
    .search-box-wrapper {
      margin: .4rem;
    }
    .shortcut {
      .list-wrapper {
        position: absolute;
        top: 3.3rem;
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
    }
    .search-result {
      position: fixed;
      top: 2.48rem;
      bottom: 0;
      width: 100%;
      &> .scroll-wrapper {
        overflow: hidden;
        height: 100%;
      }
    }
    .tip-title {
      text-align: center;
      padding: .36rem 0;
      font-size: 0;
      .icon-ok {
        font-size: $font-size-medium;
        color: $color-theme;
        margin-right: .08rem;
      }
      .text {
        font-size: $font-size-medium;
        color: $color-text;
      }
    }
  }
</style>
