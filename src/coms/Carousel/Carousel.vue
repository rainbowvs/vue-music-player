<template>
  <div class="carousel-wrapper" ref="carousel">
    <ul class="carousel-group" ref="carouselGroup">
      <slot></slot>
    </ul>
    <ul class="dots">
      <li
        class="dot"
        v-for="(item, index) in dataList"
        :class="{'active': currentPageIndex === index}"
        :key="item.id"
      ></li>
    </ul>
    <div class="init" v-if="!initial"></div>
  </div>
</template>

<script>
  import { addClass } from 'assets/js/dom';
  import BScroll from 'better-scroll';
  export default {
    props: {
      dataList: {
        type: Array,
        default: () => []
      },
      loop: {
        type: Boolean,
        default: true
      },
      autoPlay: {
        type: Boolean,
        default: true
      },
      interval: {
        type: Number,
        default: 3000
      },
      threshold: {
        type: Number,
        default: .1
      },
      speed: {
        type: Number,
        default: 400
      }
    },
    data() {
      return {
        dots: [],
        currentPageIndex: 0,
        initial: false
      };
    },
    mounted() {
      setTimeout(() => {
        this.setCarouselWidth();
        this.initDots();
        this.initCarousel();
        this.initial = true;
        if (this.autoPlay) {
          this.play();
        }
      }, 100);
      window.addEventListener('resize', this.resize);
    },
    activated() {
      if (!this.carousel) {
        return;
      }
      this.carousel.enable();
      if (this.autoPlay) {
        this.play();
      }
      window.addEventListener('resize', this.resize);
    },
    deactivated() {
      this.carousel.disable();
      clearTimeout(this.timer);
      window.removeEventListener('resize', this.resize);
    },
    methods: {
      resize() {
        this.setCarouselWidth(true);
        this.carousel.refresh();
      },
      setCarouselWidth(isResize) {
        // 设置item宽度为屏幕宽度
        this.children = this.$refs.carouselGroup.children;
        let carouselGroupWidth = 0;
        let itemWidth = this.$refs.carousel.clientWidth;
        for (let i = 0,len = this.children.length; i < len; i++) {
          let child = this.children[i];
          addClass(child, 'carousel-item');
          child.style.width = itemWidth + 'px';
          carouselGroupWidth += itemWidth;
        }
        if (this.loop && !isResize) {
          carouselGroupWidth += 2 * itemWidth;
        }
        this.$refs.carouselGroup.style.width = carouselGroupWidth + 'px';
      },
      initCarousel() {
        this.carousel = new BScroll(this.$refs.carousel, {
          scrollX: true,
          scrollY: false,
          momentum: false, // 惯性滚动
          snap: {
            loop: this.loop,
            threshold: this.threshold, // 切换触发的阈值10%
            speed: this.speed // 切换的动画时间
          }
        });
        this.carousel.on('beforeScrollStart', () => {
          // 滚动开始之前
          if (this.autoPlay) {
            clearTimeout(this.timer);
          }
        });
        this.carousel.on('scrollEnd', () => {
          // 滚动结束
          let pageIndex = this.carousel.getCurrentPage().pageX;
          this.currentPageIndex = pageIndex;
          if (this.autoPlay) {
            this.play();
          }
        });
        this.carousel.on('touchEnd', () => {
          // 鼠标/手指离开
          if (this.autoPlay) {
            this.play();
          }
        });
      },
      initDots() {
        this.dots = new Array(this.children.length);
      },
      play() {
        clearTimeout(this.timer);
        this.timer = setTimeout(() => {
          this.carousel.next();
        }, this.interval);
      }
    }
  };
</script>

<style lang="scss" scoped>
  .carousel-wrapper {
    position: relative;
    .carousel-group {
      position: relative;
      overflow: hidden;
      white-space: nowrap;
      .carousel-item {
        float: left;
        a {
          display: block;
          width: 100%;
          text-decoration: none;
        }
        img {
          display: block;
          width: 100%;
        }
      }
    }
    .dots {
      position: absolute;
      right: 0;
      left: 0;
      bottom: .24rem;
      text-align: center;
      font-size: 0;
      .dot {
        display: inline-block;
        margin: 0 .08rem;
        width: .16rem;
        height: .16rem;
        border-radius: 50%;
        background: $color-text-l;
        &.active {
          width: .4rem;
          border-radius: .1rem;
          background: $color-text-ll;
        }
      }
    }
    .init {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      z-index: 1000;
      background: $color-highlight-background;
    }
  }
</style>
