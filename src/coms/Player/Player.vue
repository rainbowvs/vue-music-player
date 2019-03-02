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
          @touchend.passive="middleTouchEnd"
        >
          <div class="middle-l" ref="middleL">
            <div class="cd-wrapper" ref="cdWrapper">
              <div class="cd" :class="cdCls">
                <img class="image" v-lazy="currentSong.image" :key="currentSong.image" />
              </div>
            </div>
            <div class="playing-lyric-wrapper">
              <div class="playing-lyric" v-html="playingLyric"></div>
            </div>
          </div>
          <scroll
            class="middle-r"
            ref="lyricList"
            :dataList="currentLyric && currentLyric.lines"
          >
            <div class="lyric-wrapper">
              <div v-if="currentLyric">
                <p
                  ref="lyricLine"
                  v-for="(line, index) in currentLyric.lines"
                  v-html="line.txt"
                  :class="['text', {'current': currentLyricLineNum === index }]"
                  :key="line.time+line.txt"
                ></p>
              </div>
              <div class="pure-music" v-show="isPureMusic">
                <p v-text="pureMusicLyric"></p>
              </div>
            </div>
          </scroll>
        </div>
        <div class="bottom">
          <div class="dot-wrapper">
            <span :class="['dot', {active: currentShow === 'cd'}]"></span>
            <span :class="['dot', {active: currentShow === 'lyric'}]"></span>
          </div>
          <div class="progress-wrapper">
            <span class="time time-l" v-text="getCurrentTime"></span>
            <div class="progress-bar-wrapper">
              <progress-bar
                ref="progressBar"
                :percent="percent"
                @percentChange="onProgressChange"
                @percentChanging="onProgressChanging"
              ></progress-bar>
            </div>
            <span class="time time-r" v-text="format(currentSong.duration)"></span>
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
        <div class="progress" :style="`width: ${percent * 100}%`"></div>
        <div class="poster">
          <img :class="cdCls" v-lazy="currentSong.image" alt="miniCDPoster" :key="currentSong.image">
        </div>
        <div class="text">
          <h2 class="name" v-html="currentSong.name"></h2>
          <p class="desc" v-html="currentSong.singer"></p>
        </div>
        <i @click.stop="togglePlaying" :class="`control music-icon ${miniPlayIcon}`"></i>
        <i @click.stop="showPlayList" class="control music-icon icon-playlist"></i>
      </div>
    </transition>
    <audio
      ref="audio"
      @playing="ready"
      @timeupdate="timeupdate"
      @ended="end"
      @error="error"
    />
    <play-list ref="playList" :songReady="songReady" />
  </div>
</template>

<script>
  import { mapGetters, mapMutations, mapActions } from 'vuex';
  import LyricParser from 'lyric-parser';
  import animations from 'create-keyframe-animation';
  import ProgressBar from './ProgressBar';
  import PlayList from './PlayList';
  import Scroll from 'coms/Scroll/Scroll';
  import TopTip from 'coms/TopTip';
  import { prefix } from 'assets/js/dom';
  import { pad } from 'assets/js/utils';
  import { playMode } from 'store/config';
  import { playerMixin } from 'assets/js/mixin';
  const docEl = document.documentElement;
  const { fontSize } = docEl.style;
  const transform = prefix('transform');
  const transitionDuration = prefix('transitionDuration');
  const timeExp = /\[(\d{2}):(\d{2}):(\d{2})\]/g;
  export default {
    mixins: [playerMixin],
    created() {
      this.touch = {}; // 保存touchstart手指数据
    },
    data() {
      return {
        songReady: false, // 歌曲是否可以播放
        dragProgress: false, // 拖动进度条
        currentTime: 0, // 正在播放歌曲的进度对应时间
        progressTime: 0, // 拖动时进度条对应时间
        currentLyric: null, // 歌词实例
        currentLyricLineNum: 0, // 播放进度对应歌词行数
        currentShow: 'cd', // 页标, 对应cd页('cd')或歌词页('lyric')
        playingLyric: '', // cd页歌词
        isPureMusic: false, // 纯音乐标记
        pureMusicLyric: '' // 纯音乐歌词模板
      };
    },
    methods: {
      onProgressChanging(percent) {
        this.dragProgress = true;
        this.progressTime = this.currentSong.duration * percent;
      },
      showPlayList() {
        this.$refs.playList.show();
      },
      middleTouchStart(e) {
        // 在touchstart事件创建一个普通对象记录手指初始位置信息
        const touchFinger = e.touches[0];
        const touch = this.touch;
        touch.initiated = true;
        touch.moved = false; // touchMove标志
        touch.startX = touchFinger.pageX;
        touch.startY = touchFinger.pageY;
      },
      middleTouchMove(e) {
        // 在touchmove事件根据初始位置计算出手指偏移量, 并用translate跟随手指
        const touch = this.touch;
        if (!touch.initiated) {
          return;
        }
        const moveTouch = e.touches[0];
        const deltaX = moveTouch.pageX - touch.startX;
        const deltaY = moveTouch.pageY - touch.startY;
        const isCDTab = this.currentShow === 'cd';
        if (Math.abs(deltaY) > Math.abs(deltaX) && !isCDTab) {
          // Scroll组件纵向滚动
          touch.initiated = false;
          return;
        }
        if (!touch.moved) {
          // 触发touchMove
          touch.moved = true;
        }
        // 歌词页左边相对于屏幕右边的平移距离
        const currentTranslateX = isCDTab ? 0 : -window.innerWidth;
        const translateX = Math.min(
          0,
          Math.max(-window.innerWidth, currentTranslateX + deltaX)
        ); // 歌词页平移限制区间[-window.innerWidth, 0]
        const lyricListStyle = this.$refs.lyricList.$el.style;
        const middleLStyle = this.$refs.middleL.style;
        touch.percent = Math.abs(translateX / window.innerWidth); // 手指横向偏移量(百分比)相对屏幕宽度
        lyricListStyle[transitionDuration] = `0ms`;
        lyricListStyle[transform] = `translate3d(${translateX}px, 0, 0)`;
        middleLStyle[transitionDuration] = `0ms`;
        middleLStyle.opacity = 1 - touch.percent;
      },
      middleTouchEnd() {
        // 在touchend事件根据手指偏移量, 判断是否达到切换条件, 最后translate平移
        const { moved, percent } = this.touch;
        if (!moved) {
          // 如果没有触发touchMove，不执行任何操作，防止跳过touchMove直接执行touchEnd，产生bug
          return;
        }
        let translateX = 0;
        let opacity = 0;
        const time = 300;
        const lyricListStyle = this.$refs.lyricList.$el.style;
        const middleLStyle = this.$refs.middleL.style;
        if (this.currentShow === 'cd') {
          if (percent > 0.1) {
            translateX = -window.innerWidth;
            opacity = 0;
            this.currentShow = 'lyric';
          } else {
            translateX = 0;
            opacity = 1;
          }
        } else {
          if (percent < 0.9) {
            translateX = 0;
            opacity = 1;
            this.currentShow = 'cd';
          } else {
            translateX = -window.innerWidth;
            opacity = 0;
          }
        }
        lyricListStyle[transitionDuration] = `${time}ms`;
        lyricListStyle[transform] = `translate3d(${translateX}px, 0, 0)`;
        middleLStyle[transitionDuration] = `${time}ms`;
        middleLStyle.opacity = opacity;
        this.touch.initiated = false;
      },
      handleLyric({lineNum, txt}) {
        if (!this.$refs.lyricLine) {
          return;
        }
        const midLine = 6;
        const { lyricLine, lyricList } = this.$refs;
        this.currentLyricLineNum = lineNum;
        if (lineNum > midLine) {
          const lineEl = lyricLine[lineNum - midLine];
          lyricList.scrollToElement(lineEl, 1000);
        } else {
          lyricList.scrollTo(0, 0, 1000);
        }
        this.playingLyric = txt;
      },
      getLyric() {
        this.currentSong.getLyric().then(lyric => {
          if (this.currentSong.lyric !== lyric) {
            // 防止异步导致创建多个歌词, 导致bug
            return;
          }
          this.currentLyric = new LyricParser(lyric, this.handleLyric);
          this.isPureMusic = !this.currentLyric.lines.length;
          if (this.isPureMusic) {
            this.pureMusicLyric = this.currentLyric.lrc.replace(timeExp, '').trim(); // 纯音乐去掉时间
            this.playingLyric = this.pureMusicLyric;
          } else {
            this.pureMusicLyric = '';
            if (this.playing && this.canLyricPlay) {
              // 歌词出现晚于歌曲播放，要切到对应位置
              this.currentLyric.seek(this.currentTime * 1000);
            }
          }
        }).catch(() => {
          this.currentLyric = null;
          this.playingLyric = '';
          this.currentLyricLineNum = 0;
        });
      },
      loop() {
        this.$refs.audio.currentTime = 0;
        this.$refs.audio.play();
        if (!this.playing) {
          this.setPlayingState(true);
        }
      },
      end() {
        if (this.mode === playMode.loop) {
          this.loop();
        } else {
          this.next();
        }
      },
      onProgressChange(percent) {
        this.dragProgress = false;
        const currentTime = this.currentSong.duration * percent;
        if (!this.playing) {
          this.togglePlaying();
        }
        if (this.currentLyric) {
          // 歌词跟随进度改变，UC中currentTime改变不会触发playing事件，因此需要手动调整
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
        this.canLyricPlay = true;
        this.savePlayHistory(this.currentSong);
        if (this.currentLyric && !this.isPureMusic) {
          // 歌曲的播放晚于歌词的出现，播放的时候需要同步歌词
          this.currentLyric.seek(this.currentTime * 1000);
        }
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
        const scale = miniCDWidth / CDWidth; // CD => miniCD 缩小比率
        const x = -(window.innerWidth / 2 - left); // miniCD圆心和CD圆心的x坐标距离差
        const y = window.innerHeight - CDTop - CDWidth / 2 - bottom; // miniCD圆心和CD圆心的y坐标距离差
        return {
          x, // CD从miniCD坐标出发，水平位移距离
          y, // CD从miniCD坐标出发，垂直位移距离
          scale // CD => miniCD缩小倍数
        };
      },
      enter(el, done) {
        const { x, y, scale } = this.getPosAndScale(); // 计算平移位置和缩小倍数

        // CSS3动画可以控制过程, 过渡动画只能控制结果
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

        // 注册
        animations.registerAnimation({
          name: 'move',
          animation,
          presets: {
            duration: 400,
            easing: 'linear'
          }
        });

        // 运行
        animations.runAnimation(this.$refs.cdWrapper, 'move', done);
      },
      afterEnter() {
        // 销毁
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
      getCurrentTime() {
        return this.dragProgress
          ? this.format(this.progressTime)
          : this.format(this.currentTime);
      },
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
        if (!newVal.id || newVal.id === oldVal.id) {
          return;
        }
        if (!newVal.url) {
          TopTip(`${newVal.name}歌曲url错误，自动切换下一首`);
          this.songReady = true;
          this.next();
        }
        this.currentTime = 0;
        this.songReady = false; // currentIndex切歌必须重新设为false，防止抛异常
        this.canLyricPlay = false;
        if (this.currentLyric) {
          // 切换歌曲时需清理歌词计时器
          this.currentLyric.stop();
          this.currentLyric = null;
          this.playingLyric = '';
          this.currentLyricLineNum = 0;
        }
        this.$refs.audio.src = newVal.url; // 不能用:src, 防止随机生成的vkey导致判断为新歌曲
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
      },
      fullScreen(newVal) {
        if (newVal) {
          this.$nextTick(() => {
            this.$refs.lyricList.refresh();
            // （暂停时切换）全屏播放后重置进度条，防止进度条停在收起时
            this.$refs.progressBar.setProgressWidth(null, this.percent);
          });
        }
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
        bottom: 2.9rem;
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
            margin: .4rem auto 0 auto;
            overflow: hidden;
            text-align: center;
            .playing-lyric {
              @include ellipsis();
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
              white-space: normal;
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
        bottom: .5rem;
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
            font-size: $font-size-small-x;
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
      .poster {
        flex: 0 0 .8rem;
        width: .8rem;
        height: .8rem;
        padding: 0 .2rem 0 .4rem;
        img {
          @include play-rotate();
          height: 100%;
          width: 100%;
          border-radius: 50%;
        }
      }
      .text {
        @include flex(column, center, flex-start);
        flex-grow: 1;
        line-height: .4rem;
        overflow: hidden;
        .name {
          @include ellipsis();
          width: 100%;
          margin: 0;
          margin-bottom: .04rem;
          font-weight: normal;
          font-size: $font-size-medium;
          color: $color-text;
        }
        .desc {
          @include ellipsis();
          width: 100%;
          margin: 0;
          font-size: $font-size-medium;
          color: $color-text-d;
        }
      }
      .control {
        flex: 0 0 .6rem;
        padding: .2rem;
        &.icon-play-mini, &.icon-pause-mini, &.icon-playlist {
          font-size: .6rem;
          color: $color-theme-d;
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
