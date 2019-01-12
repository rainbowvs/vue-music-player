<template>
  <div class="music-list">
    <div class="back" @click="back">
      &lt;
    </div>
    <h1 class="title" v-text="title"></h1>
    <div class="bg-image" :style="bgStyle" ref="bgImage">
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
  const docEl = document.documentElement;
  const { fontSize } = docEl.style;
  const RESERVED_HEIGHT = parseFloat(fontSize) * 0.8; // rem精确浮点数
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
      this.imageHeight = this.$refs.bgImage.clientHeight;
      this.minTransalteY = -this.imageHeight + RESERVED_HEIGHT;
      console.log(this.minTransalteY);
      this.$refs.list.$el.style.top = `${this.imageHeight}px`;
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
        this.$router.push({
          name: 'Singer'
        });
      }
    },
    watch: {
      scrollY(newY) {
        const translateY = Math.max(this.minTransalteY, newY);
        let zIndex = 0;
        this.$refs.layer.style['transform'] = `translate3d(0, ${translateY}px, 0)`;
        this.$refs.layer.style['webkitTransform'] = `translate3d(0, ${translateY}px, 0)`;
        if (newY < this.minTransalteY) {
          zIndex = 1;
          this.$refs.bgImage.style.paddingTop = 0;
          this.$refs.bgImage.style.height = `${RESERVED_HEIGHT}px`;
        } else {
          this.$refs.bgImage.style.paddingTop = '70%';
          this.$refs.bgImage.style.height = 0;
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
    .back {
      position: absolute;
      top: 0;
      left: .12rem;
      z-index: 2;
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
      position: fixed;
      top: 0;
      bottom: 0;
      width: 100%;
      background: $color-background;
      .song-list-wrapper {
        padding: .4rem .6rem;
      }
    }
  }
</style>

