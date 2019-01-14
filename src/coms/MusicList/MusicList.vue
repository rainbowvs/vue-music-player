<template>
  <div class="music-list">
    <div class="back" @click="back">
      <i class="music-icon icon-back"></i>
    </div>
    <h1 class="title" v-text="title"></h1>
    <div class="bg-image" :style="bgStyle" ref="bgImage">
      <div class="play-wrapper" v-show="songs.length > 0" ref="playBtn">
        <div class="play">
          <i class="music-icon icon-play"></i>
          <span class="text">随机播放全部</span>
        </div>
      </div>
      <div class="filter" ref="filter"></div>
    </div>
    <div class="bg-layer" ref="layer"></div>
    <scroll
      class="list"
      ref="list"
      :data="songs"
      :listen-scroll="listenScroll"
      :probe-type="probeType"
      @scroll="scroll"
    >
      <div class="scroll-content">
        <div class="song-list-wrapper">
          <song-list :songs="songs"></song-list>
        </div>
        <div v-show="!songs.length" class="loading-container">
          <loading></loading>
        </div>
      </div>
    </scroll>
  </div>
</template>

<script>
  import Scroll from 'coms/Scroll/Scroll';
  import Loading from 'coms/Loading/Loading';
  import SongList from 'coms/SongList/SongList';
  import { prefix } from 'assets/js/dom';
  const docEl = document.documentElement;
  const { fontSize } = docEl.style;
  const RESERVED_HEIGHT = parseFloat(fontSize) * 0.8; // rem精确浮点数
  const transform = prefix('transform');
  const backdrop = prefix('backdrop-filter');
  export default {
    props: {
      bgImage: {
        type: String,
        default: ''
      },
      songs: {
        type: Array,
        default: () => []
      },
      title: {
        type: String,
        default: ''
      }
    },
    created() {
      this.probeType = 3;
      this.listenScroll = true;
    },
    mounted() {
      this.imageHeight = this.$refs.bgImage.clientHeight; // 歌手图片高度
      this.minTransalteY = -this.imageHeight + RESERVED_HEIGHT; // 遮挡图片的最小滚动位移
      this.$refs.list.$el.style.top = `${this.imageHeight}px`; // 防止遮挡歌手图片
    },
    data() {
      return {
        scrollY: 0
      };
    },
    methods: {
      scroll(pos) {
        this.scrollY = pos.y;
      },
      back() {
        this.$router.back();
      }
    },
    watch: {
      scrollY(newY) {
        const translateY = Math.max(this.minTransalteY, newY);
        let percent = Math.abs(newY / this.imageHeight);
        let zIndex = 0; // 歌手图片层级
        let scale = 1; // 歌手图片缩放倍数
        let blur = 0; // 歌手图片模糊，backdrop只适配ios，filter后代dom一起渲染，性能不行
        if (newY > 0) {
          // 滚动超出顶部
          scale = 1 + percent; // 放大
        } else {
          // 往下滚动
          blur = Math.min(20 * percent, 20); // 模糊
        }
        this.$refs.bgImage.style[transform] = `scale(${scale})`;
        this.$refs.layer.style[transform] = `translate3d(0, ${translateY}px, 0)`;
        this.$refs.filter.style[backdrop] = `blur(${blur}px)`;
        if (Math.abs(newY) > Math.abs(this.minTransalteY)) {
          // 滚动覆盖歌手图片
          this.$refs.bgImage.style.paddingTop = 0;
          this.$refs.bgImage.style.height = `${RESERVED_HEIGHT}px`;
          this.$refs.playBtn.style.display = 'none';
          zIndex = 1; // 图片仅显示保留高度
        } else {
          this.$refs.bgImage.style.paddingTop = '70%';
          this.$refs.bgImage.style.height = 0;
          this.$refs.playBtn.style.display = 'block';
        }
        this.$refs.bgImage.style.zIndex = zIndex;
      }
    },
    computed: {
      bgStyle() {
        return `background-image: url(${this.bgImage})`;
      }
    },
    components: {
      Scroll,
      SongList,
      Loading
    }
  };
</script>

<style lang="scss" scoped>
  .music-list {
    width: 100%;
    height: 100%;
    background: $color-background;
    .scroll-wrapper {
      overflow: visible;
    }
    .back {
      position: absolute;
      top: 0;
      left: .12rem;
      z-index: 2;
      .icon-back {
        display: block;
        padding: 10px;
        font-size: $font-size-large;
        color: $color-theme;
      }
    }
    .title {
      @include ellipsis();
      margin: 0;
      position: absolute;
      top: 0;
      left: 10%;
      z-index: 2;
      width: 80%;
      font-weight: normal;
      text-align: center;
      line-height: .8rem;
      font-size: $font-size-large;
      color: $color-text;
    }
    .bg-image {
      position: relative;
      width: 100%;
      height: 0;
      padding-top: 70%;
      transform-origin: top;
      background-size: cover;
      .play-wrapper {
        position: absolute;
        bottom: .4rem;
        z-index: 1;
        text-align: center;
        width: 100%;
        .play {
          border: 1px solid $color-theme;
          border-radius: 100px;
          display: inline-block;
          box-sizing: border-box;
          padding: .14rem .3rem;
          margin: 0 auto;
          text-align: center;
          color: $color-theme;
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
            font-size: $font-size-medium;
          }
        }
      }
      .filter {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(7, 17, 27, 0.4);
      }
    }
    .bg-layer {
      position: relative;
      height: 100%;
      background: $color-background;
    }
    .list {
      .song-list-wrapper {
        padding: .4rem .6rem;
      }
    }
  }
</style>

