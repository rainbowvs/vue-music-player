<template>
  <div class="scroll-wrapper" ref="wrapper">
    <slot></slot>
  </div>
</template>

<script>
  import BScroll from 'better-scroll';
  export default {
    props: {
      probeType: {
        type: Number,
        default: 1
      },
      click: {
        type: Boolean,
        default: true
      },
      listenScroll: {
        type: Boolean,
        default: false
      },
      dataList: {
        type: Array,
        default: null
      },
      pullup: {
        type: Boolean,
        default: false
      },
      beforeScroll: {
        type: Boolean,
        default: false
      }
    },
    mounted() {
      this.$nextTick(() => {
        this.initScroll();
      });
    },
    methods: {
      initScroll() {
        if (!this.$refs.wrapper) {
          return;
        }
        this.scroll = new BScroll(this.$refs.wrapper, {
          probeType: this.probeType,
          click: this.click
        });

        if (this.listenScroll) {
          this.scroll.on('scroll', pos => {
            this.$emit('scroll', pos);
          });
        }

        if (this.pullup) {
          this.scroll.on('scrollEnd', () => {
            if (this.scroll.y <= (this.scroll.maxScrollY + 50)) {
              this.$emit('scrollToEnd');
            }
          });
        }

        if (this.beforeScroll) {
          this.scroll.on('beforeScrollStart', () => {
            // 滑动开始事件
            this.$emit('beforeScroll');
          });
        }
      },
      refresh() {
        this.scroll && this.scroll.refresh();
      },
      scrollTo() {
        this.scroll && this.scroll.scrollTo.apply(this.scroll, arguments);
      },
      scrollToElement() {
        this.scroll && this.scroll.scrollToElement.apply(this.scroll, arguments);
      }
    },
    watch: {
      dataList() {
        this.$nextTick(() => {
          this.refresh();
        });
      }
    }
  };
</script>
