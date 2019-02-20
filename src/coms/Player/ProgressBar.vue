<template>
  <div class="progress-bar" ref="progressBar" @click="progressClick">
    <div class="bar-inner">
      <div class="progress" ref="progress"></div>
      <div
        ref="progressBtn"
        class="progress-btn-wrapper"
        @touchstart.prevent="progressTouchStart"
        @touchmove.prevent="progressTouchMove"
        @touchend.passive="progressTouchEnd"
      >
        <div class="progress-btn"></div>
      </div>
    </div>
  </div>
</template>

<script>
  import { prefix } from 'assets/js/dom';
  const transform = prefix('transform');
  export default {
    props: {
      percent: {
        type: Number,
        default: 0
      }
    },
    created() {
      this.touch = {};
    },
    methods: {
      progressClick(e) {
        const rect = this.$refs.progress.getBoundingClientRect();
        const progressWidth = e.pageX - rect.left;
        this.setProgressWidth(progressWidth);
        this.percentChange();
      },
      progressTouchStart(e) {
        this.touch.initiated = true;
        this.touch.startX = e.touches[0].pageX;
        this.touch.left = this.$refs.progress.clientWidth;
      },
      progressTouchMove(e) {
        if (!this.touch.initiated) {
          return;
        }
        const deltaX = e.touches[0].pageX - this.touch.startX; // 拖拽距离
        const progressWidth = Math.min(
          this.$refs.progressBar.clientWidth,
          Math.max(0, this.touch.left + deltaX)
        ); // 限制区间为[0, progressWidth]，否则会超出进度条
        this.setProgressWidth(progressWidth);
        const barWidth = this.$refs.progressBar.clientWidth;
        const percent = this.$refs.progress.clientWidth / barWidth;
        this.$emit('percentChanging', percent);
      },
      progressTouchEnd() {
        this.touch.initiated = false;
        this.percentChange();
      },
      percentChange() {
        const barWidth = this.$refs.progressBar.clientWidth;
        const percent = this.$refs.progress.clientWidth / barWidth;
        this.$emit('percentChange', percent);
      },
      setProgressWidth(progressWidth, percent) {
        let calWidth = progressWidth;
        if (percent) {
          const barWidth = this.$refs.progressBar.clientWidth;
          calWidth = percent * barWidth;
        }
        this.$refs.progress.style.width = `${calWidth}px`;
        this.$refs.progressBtn.style[transform] = `translate3d(${calWidth}px, 0, 0)`;
      }
    },
    watch: {
      percent(newVal) {
        if (newVal >= 0 && !this.touch.initiated) {
          this.setProgressWidth(null, newVal);
        }
      }
    }
  };
</script>

<style lang="scss" scoped>
  .progress-bar {
    @include flex(row);
    height: .6rem;
    .bar-inner {
      width: 100%;
      position: relative;
      height: 4px;
      background: rgba(0, 0, 0, 0.3);
      border-radius: 2px;
      .progress {
        position: absolute;
        height: 100%;
        background: $color-theme;
        border-radius: 2px;
      }
      .progress-btn-wrapper {
        position: absolute;
        left: -15px;
        top: -13px;
        width: 30px;
        height: 30px;
        .progress-btn {
          position: relative;
          top: 7px;
          left: 7px;
          box-sizing: border-box;
          width: 16px;
          height: 16px;
          border: 3px solid $color-text;
          border-radius: 50%;
          background: $color-theme;
        }
      }
    }
  }
</style>
