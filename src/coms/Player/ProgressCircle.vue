<template>
  <div class="progress-cicle">
    <svg :width="radius" :height="radius" viewBox="0 0 100 100" version="1.1" xmlns="http://www.w3.org/2000/svg">
      <circle class="progress-background" r="50" cx="50" cy="50" fill="transparent" />
      <circle
        class="progress-bar"
        r="50" cx="50" cy="50"
        fill="transparent"
        :stroke-dasharray="dashArray"
        :stroke-dashoffset="dashOffset"
        stroke-linecap="round"
      />
    </svg>
    <slot></slot>
  </div>
</template>

<script>
  export default {
    props: {
      percent: {
        type: Number,
        default: 0
      },
      radius: {
        type: Number,
        default: 100
      }
    },
    data() {
      return {
        dashArray: 2 * 50 * Math.PI
      };
    },
    computed: {
      dashOffset() {
        return (1 - this.percent) * this.dashArray;
      }
    }
  };
</script>

<style lang="scss" scoped>
  .progress-cicle {
    position: relative;
    svg {
      display: block;
    }
    circle {
      stroke-width: 8px;
      transform-origin: center;
      &.progress-background {
        transform: scale(0.9);
        stroke: $color-theme-d;
      }
      &.progress-bar {
        transform: scale(0.9) rotate(-90deg);
        stroke: $color-theme;
      }
    }
  }
</style>
