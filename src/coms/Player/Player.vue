<template>
  <div class="player" v-show="playList.length > 0">
    <transition
      name="normal"
      @enter="enter"
      @after-enter="afterEnter"
      @leave="leave"
      @after-leave="afterLeave"
    >
      <div class="normal-player" v-show="fullScreen">
        <div class="background">
          <img :src="currentSong.image" alt="背景底图">
        </div>
        <div class="top">
          <div class="back" @click="back">
            <i class="music-icon icon-back"></i>
          </div>
          <h1 class="title" v-html="currentSong.name"></h1>
          <h2 class="subtitle" v-html="currentSong.singer"></h2>
        </div>
        <div
          class="middle"
          @touchstart.prevent="middleTouchStart"
          @touchmove.prevent="middleTouchMove"
          @touchend="middleTouchEnd"
        >
          <div class="middle-l" ref="middleL">
            <div class="cd-wrapper" ref="cdWrapper">
              <div class="cd" :class="cdCls">
                <img :src="currentSong.image" class="image" />
              </div>
            </div>
            <div class="playing-lyric-wrapper">
              <div class="playing-lyric">{{playingLyric}}</div>
            </div>
          </div>
          <scroll
            class="middle-r"
            ref="lyricList"
            :data="currentLyric && currentLyric.lines"
            style="position: static;"
        >
            <div class="lyric-wrapper">
              <div v-if="currentLyric">
                <p
                  ref="lyricLine"
                  class="text"
                  :class="{'current': currentLyricLineNum === index }"
                  v-for="(line, index) in currentLyric.lines"
                  :key="line.time"
                >{{line.txt}}</p>
              </div>
            </div>
          </scroll>
        </div>
        <div class="bottom">
          <div class="dot-wrapper">
            <span class="dot" :class="{active: currentShow === 'cd'}"></span>
            <span class="dot" :class="{active: currentShow === 'lyric'}"></span>
          </div>
          <div class="progress-wrapper">
            <span class="time time-l">{{format(currentTime)}}</span>
            <div class="progress-bar-wrapper">
              <progress-bar :percent="percent" @percentChange="onProgressChange"></progress-bar>
            </div>
            <span class="time time-r">{{format(currentSong.duration)}}</span>
          </div>
          <div class="operators">
            <i @click="changeMode" :class="`music-icon ${modeIcon}`"></i>
            <i @click="prev" :class="`music-icon icon-prev ${disabledCls}`"></i>
            <i @click="togglePlaying" :class="`play-pause music-icon ${playIcon} ${disabledCls}`"></i>
            <i @click="next" :class="`music-icon icon-next ${disabledCls}`"></i>
            <i @click="toggleFavorite(currentSong)" :class="`music-icon ${favoriteIcon(currentSong)}`"></i>
          </div>
        </div>
      </div>
    </transition>
    <transition name="mini">
      <div class="mini-player" v-show="!fullScreen" @click="open">
        <div class="progress" :style="`width: ${percent*100}%`"></div>
        <div class="icon">
          <div ref="miniWrapper" :class="`imgWrapper ${cdCls}`">
            <img :src="currentSong.image" alt="miniCDPost">
          </div>
        </div>
        <div class="text">
          <h2 class="name" v-html="currentSong.name"></h2>
          <p class="desc" v-html="currentSong.singer"></p>
        </div>
        <div class="control">
          <i @click.stop="togglePlaying" :class="`music-icon ${miniPlayIcon}`"></i>
        </div>
        <div class="control">
          <i @click.stop="showPlayList" class="music-icon icon-playlist"></i>
        </div>
      </div>
    </transition>
    <audio
      ref="audio"
      :src="currentSong.url"
      @canplay="ready"
      @timeupdate="timeupdate"
      @ended="end"
      @error="error"
    />
    <play-list ref="playList" />
  </div>
</template>

<script>
  import LyricParser from 'lyric-parser';
  import { mapGetters, mapMutations, mapActions } from 'vuex';
  import animations from 'create-keyframe-animation';
  import ProgressBar from './ProgressBar';
  import PlayList from './PlayList';
  import Scroll from 'coms/Scroll/Scroll';
  import { prefix } from 'assets/js/dom';
  import { pad } from 'assets/js/utils';
  import { playMode } from 'store/config';
  import { playerMixin } from 'assets/js/mixin';
  const docEl = document.documentElement;
  const { fontSize } = docEl.style;
  const transform = prefix('transform');
  const transitionDuration = prefix('transitionDuration');
  export default {
    mixins: [playerMixin],
    created() {
      this.touch = {};
    },
    data() {
      return {
        songReady: false,
        currentTime: 0,
        currentLyric: null,
        currentLyricLineNum: 0,
        currentShow: 'cd',
        playingLyric: ''
      };
    },
    methods: {
      showPlayList() {
        this.$refs.playList.show();
      },
      middleTouchStart(e) {
        this.touch.initiated = true;
        const touch = e.touches[0];
        this.touch.startX = touch.pageX;
        this.touch.startY = touch.pageY;
      },
      middleTouchMove(e) {
        if (!this.touch.initiated) {
          return;
        }
        const touch = e.touches[0];
        const deltaX = touch.pageX - this.touch.startX;
        const deltaY = touch.pageY - this.touch.startY;
        if (Math.abs(deltaY) > Math.abs(deltaX)) {
          // Scroll组件纵向滚动
          return;
        }
        // 歌词当前平移距离
        const currentTranslateX = this.currentShow === 'cd' ? 0 : -window.innerWidth;
        const translateX = Math.min(
          0,
          Math.max(-window.innerWidth, currentTranslateX + deltaX)
        ); // 平移限制区间[-window.innerWidth, 0]
        this.touch.percent = Math.abs(translateX / window.innerWidth);
        this.$refs.lyricList.$el.style[transitionDuration] = `0ms`;
        this.$refs.lyricList.$el.style[transform] = `translate3d(${translateX}px, 0, 0)`;
        this.$refs.middleL.style[transitionDuration] = `0ms`;
        this.$refs.middleL.style.opacity = 1 - this.touch.percent;
      },
      middleTouchEnd() {
        let translateX = 0;
        let opacity = 0;
        const time = 300;
        if (this.currentShow === 'cd') {
          if (this.touch.percent > 0.1) {
            translateX = -window.innerWidth;
            opacity = 0;
            this.currentShow = 'lyric';
          } else {
            translateX = 0;
            opacity = 1;
          }
        } else {
          if (this.touch.percent < 0.9) {
            translateX = 0;
            opacity = 1;
            this.currentShow = 'cd';
          } else {
            translateX = -window.innerWidth;
            opacity = 0;
          }
        }
        this.$refs.lyricList.$el.style[transitionDuration] = `${time}ms`;
        this.$refs.lyricList.$el.style[transform] = `translate3d(${translateX}px, 0, 0)`;
        this.$refs.middleL.style[transitionDuration] = `${time}ms`;
        this.$refs.middleL.style.opacity = opacity;
      },
      handleLyric({lineNum, txt}) {
        this.currentLyricLineNum = lineNum;
        if (lineNum > 5) {
          const lineEl = this.$refs.lyricLine[lineNum - 5];
          this.$refs.lyricList.scrollToElement(lineEl, 1000);
        } else {
          this.$refs.lyricList.scrollTo(0, 0, 1000);
        }
        this.playingLyric = txt;
      },
      getLyric() {
        this.currentSong.getLyric().then(lyric => {
          this.currentLyric = new LyricParser(lyric, this.handleLyric);
          this.currentLyric.play();
        }).catch(() => {
          this.currentLyric = null;
          this.playingLyric = '';
          this.currentLyricLineNum = 0;
        });
      },
      loop() {
        if (this.currentLyric) {
          // 歌词重新播放
          this.currentLyric.seek(0);
        }
        this.$refs.audio.currentTime = 0;
        this.$refs.audio.play();
      },
      end() {
        if (this.mode === playMode.loop) {
          this.loop();
        } else {
          this.next();
        }
      },
      onProgressChange(percent) {
        const currentTime = this.currentSong.duration * percent;
        if (!this.playing) {
          this.togglePlaying();
        }
        if (this.currentLyric) {
          // 歌词跟随进度改变
          this.currentLyric.seek(currentTime * 1000);
        }
        this.$refs.audio.currentTime = currentTime;
      },
      format(interval) {
        const val = interval | 0;
        const minutes = pad(val / 60 | 0);
        const seconds = pad(val % 60);
        return `${minutes}:${seconds}`;
      },
      timeupdate(e) {
        this.currentTime = e.target.currentTime;
      },
      error() {
        this.songReady = true;
      },
      ready() {
        // 音频准备就绪，期间操作DOM会抛异常
        this.songReady = true;
        this.savePlayHistory(this.currentSong);
      },
      prev() {
        if (!this.songReady) {
          return;
        }
        if (this.playList.length === 1) {
          // 播放列表只有一首歌
          this.loop();
        } else {
          let index = this.currentIndex - 1;
          if (index === -1) {
            index = this.playList.length - 1;
          }
          if (!this.playing) {
            this.togglePlaying();
          }
          this.setCurrentIndex(index);
        }
        this.songReady = false;
      },
      next() {
        if (!this.songReady) {
          return;
        }
        if (this.playList.length === 1) {
          // 播放列表只有一首歌
          this.loop();
        } else {
          let index = this.currentIndex + 1;
          if (index === this.playList.length) {
            index = 0;
          }
          if (!this.playing) {
            this.togglePlaying();
          }
          this.setCurrentIndex(index);
        }
        this.songReady = false;
      },
      togglePlaying() {
        if (!this.songReady) {
          return;
        }
        if (this.currentLyric) {
          // 歌词跟随歌曲播放状态
          this.currentLyric.togglePlay();
        }
        this.setPlayingState(!this.playing);
      },
      getPosAndScale() {
        const miniCDWidth = parseFloat(fontSize) * 0.8; // miniCD宽度
        const left = parseFloat(fontSize) * 0.8; // miniCD圆心与screen左边距离
        const bottom = parseFloat(fontSize) * 0.6; // miniCD圆心与screen下边距离
        const CDTop = parseFloat(fontSize) * 1.6; // CD圆心与screen下边距离
        const CDWidth = window.innerWidth * 0.8; // CD宽度
        const scale = miniCDWidth / CDWidth; // CD => miniCD 缩放比率
        const x = -(window.innerWidth / 2 - left); // miniCD圆心和CD圆心的x坐标距离差
        const y = window.innerHeight - CDTop - CDWidth / 2 - bottom; // miniCD圆心和CD圆心的y坐标距离差
        return {
          x, // CD从miniCD坐标出发，水平位移距离
          y, // CD从miniCD坐标出发，垂直位移距离
          scale // CD从miniCD坐标出发，放大倍数
        };
      },
      enter(el, done) {
        const {x, y, scale} = this.getPosAndScale();

        let animation = {
          0: {
            transform: `translate3d(${x}px, ${y}px, 0) scale(${scale})`
          },
          60: {
            transform: `translate3d(0, 0, 0) scale(1.1)`
          },
          100: {
            transform: `translate3d(0, 0, 0) scale(1)`
          }
        };

        animations.registerAnimation({
          name: 'move',
          animation,
          presets: {
            duration: 400,
            easing: 'linear'
          }
        });

        animations.runAnimation(this.$refs.cdWrapper, 'move', done);
      },
      afterEnter() {
        animations.unregisterAnimation('move');
        this.$refs.cdWrapper.style.animation = '';
      },
      leave(el, done) {
        this.$refs.cdWrapper.style.transition = 'all .4s';
        const {x, y, scale} = this.getPosAndScale();
        this.$refs.cdWrapper.style[transform] = `translate3d(${x}px, ${y}px, 0) scale(${scale})`;
        const timer = setTimeout(done, 400);
        this.$refs.cdWrapper.addEventListener('transitionend', () => {
          clearTimeout(timer);
          done();
        });
      },
      afterLeave() {
        this.$refs.cdWrapper.style.transition = '';
        this.$refs.cdWrapper.style[transform] = '';
      },
      open() {
        this.setFullScreen(true);
      },
      back() {
        this.setFullScreen(false);
      },
      ...mapMutations({
        setFullScreen: 'SET_FULL_SCREEN',
        setPlayingState: 'SET_PLAYING_STATE'
      }),
      ...mapActions([
        'savePlayHistory'
      ])
    },
    computed: {
      percent() {
        return this.currentTime / this.currentSong.duration;
      },
      disabledCls() {
        return this.songReady ? '' : 'disabled';
      },
      cdCls() {
        return this.playing ? 'play' : 'play pause';
      },
      playIcon() {
        return this.playing ? 'icon-pause' : 'icon-play';
      },
      miniPlayIcon() {
        return this.playing ? 'icon-pause-mini' : 'icon-play-mini';
      },
      ...mapGetters([
        'fullScreen',
        'playList',
        'playing',
        'currentIndex'
      ])
    },
    watch: {
      currentSong(newVal, oldVal) {
        if (!newVal.id) {
          return;
        }
        if (newVal.id === oldVal.id) {
          return;
        }
        if (this.currentLyric) {
          // 切换歌曲时需清理歌词计时器
          this.currentLyric.stop();
        }
        this.$nextTick(() => {
          this.$refs.audio.play();
          this.getLyric();
        });
      },
      playing(newVal) {
        const audio = this.$refs.audio;
        this.$nextTick(() => {
          newVal ? audio.play() : audio.pause();
        });
      }
    },
    components: {
      ProgressBar,
      Scroll,
      PlayList
    }
  };
</script>


<style lang="scss" scoped>
  @mixin play-rotate() {
    &.play {
      animation: rotate 10s linear infinite;
    }
    &.pause {
      animation-play-state: paused;
    }
  }
  .player {
    .normal-player {
      position: fixed;
      left: 0;
      right: 0;
      top: 0;
      bottom: 0;
      z-index: 4;
      background: $color-background;
      .background {
        position: absolute;
        left: 0;
        top: 0;
        right: 0;
        bottom: 0;
        z-index: -1;
        opacity: 0.6;
        filter: blur(20px);
        img {
          width: 100%;
          height: 100%;
        }
      }
      .top {
        position: relative;
        margin-bottom: .5rem;
        .back {
          position: absolute;
          top: 0;
          left: .12rem;
          z-index: 50;
          .icon-back {
            display: block;
            padding: .18rem;
            font-size: $font-size-large-x;
            color: $color-theme;
            transform: rotate(-90deg);
          }
        }
        .title {
          @include ellipsis();
          width: 70%;
          margin: 0 auto;
          line-height: .8rem;
          text-align: center;
          font-weight: normal;
          font-size: $font-size-large;
          color: $color-text;
        }
        .subtitle {
          margin: 0;
          font-weight: normal;
          line-height: .4rem;
          text-align: center;
          font-size: $font-size-medium;
          color: $color-text;
        }
      }
      .middle {
        position: fixed;
        width: 100%;
        top: 1.6rem;
        bottom: 3.4rem;
        white-space: nowrap;
        font-size: 0;
        .middle-l {
          display: inline-block;
          vertical-align: top;
          position: relative;
          width: 100%;
          height: 0;
          padding-top: 80%;
          .cd-wrapper {
            position: absolute;
            left: 10%;
            top: 0;
            width: 80%;
            box-sizing: border-box;
            height: 100%;
            z-index: 4;
            .cd {
              @include play-rotate();
              width: 100%;
              height: 100%;
              border-radius: 50%;
              .image {
                position: absolute;
                left: 0;
                top: 0;
                width: 100%;
                height: 100%;
                box-sizing: border-box;
                border-radius: 50%;
                border: 10px solid rgba(255, 255, 255, 0.1);
              }
            }
          }
          .playing-lyric-wrapper {
            width: 80%;
            margin: .6rem auto 0 auto;
            overflow: hidden;
            text-align: center;
            .playing-lyric {
              height: .4rem;
              line-height: .4rem;
              font-size: $font-size-medium;
              color: $color-text-l;
            }
          }
        }
        .middle-r {
          display: inline-block;
          vertical-align: top;
          width: 100%;
          height: 100%;
          overflow: hidden;
          .lyric-wrapper {
            width: 80%;
            margin: 0 auto;
            overflow: hidden;
            text-align: center;
            .text {
              margin: 0;
              line-height: .64rem;
              color: $color-text-l;
              font-size: $font-size-medium;
              &.current {
                color: $color-text;
              }
            }
            .pure-music {
              padding-top: 50%;
              line-height: .64rem;
              color: $color-text-l;
              font-size: $font-size-medium;
            }
          }
        }
      }
      .bottom {
        position: absolute;
        bottom: 1rem;
        width: 100%;
        .dot-wrapper {
          text-align: center;
          font-size: 0;
          .dot {
            display: inline-block;
            vertical-align: middle;
            margin: 0 .08rem;
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background: $color-text-l;
            &.active {
              width: .4rem;
              border-radius: .1rem;
              background: $color-text-ll;
            }
          }
        }
        .progress-wrapper {
          @include flex(row);
          width: 85%;
          margin: 0px auto;
          padding: .2rem 0;
          .time {
            color: $color-text;
            font-size: $font-size-small;
            line-height: .6rem;
          }
          .progress-bar-wrapper {
            margin: 0 .3rem;
            flex: 1;
          }
        }
        .operators{
          @include flex(row, space-around);
          padding: 0 .4rem;
          & > i {
            font-size: .6rem;
            color: $color-theme;
            &.play-pause {
              font-size: .8rem;
            }
            &.disabled {
              color: $color-theme-d;
            }
            &.icon-favorite {
              color: $color-sub-theme;
            }
          }
        }
      }
      &.normal-enter-active, &.normal-leave-active {
        transition: all .4s;
        .top, .bottom {
          transition: all .4s cubic-bezier(0.86, 0.18, 0.82, 1.32);
        }
      }
      &.normal-enter, &.normal-leave-to {
        opacity: 0;
        .top {
          transform: translate3d(0, -2rem, 0);
        }
        .bottom {
          transform: translate3d(0, 2rem, 0);
        }
      }
    }
    .mini-player {
      @include flex(row, space-between);
      position: fixed;
      left: 0;
      bottom: 0;
      z-index: 3;
      width: 100%;
      height: 1.2rem;
      background: $color-highlight-background;
      &.mini-enter-active, &.mini-leave-active {
        transition: all 0.4s;
      }
      &.mini-enter, &.mini-leave-to {
        opacity: 0;
      }
      .progress {
        position: absolute;
        left: 0;
        top: 0;
        z-index: 1;
        height: 1px;
        background: $color-theme;
      }
      .icon {
        flex: 0 0 .8rem;
        width: .8rem;
        height: .8rem;
        padding: 0 .2rem 0 .4rem;
        .imgWrapper {
          @include play-rotate();
          height: 100%;
          width: 100%;
          img {
            height: 100%;
            width: 100%;
            border-radius: 50%;
          }
        }
      }
      .text {
        @include flex(column, center, flex-start);
        flex-grow: 1;
        line-height: .4rem;
        overflow: hidden;
        .name {
          @include ellipsis();
          margin: 0;
          margin-bottom: .04rem;
          font-weight: normal;
          font-size: $font-size-medium;
          color: $color-text;
        }
        .desc {
          @include ellipsis();
          margin: 0;
          font-size: $font-size-small;
          color: $color-text-d;
        }
      }
      .control {
        flex: 0 0 .6rem;
        padding: 0 .2rem;
        .icon-play-mini, .icon-pause-mini, .icon-playlist {
          font-size: .6rem;
          color: $color-theme-d;
        }
        .icon-mini {
          font-size: .64rem;
          position: absolute;
          left: 0;
          top: 0;
        }
      }
    }
  }

  @keyframes rotate {
    0% {
      transform: rotate(0);
    }
    100% {
      transform: rotate(360deg);
    }
  }
</style>
