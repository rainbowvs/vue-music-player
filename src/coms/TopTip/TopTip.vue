<template>
  <transition name="drop">
    <div class="top-tip" v-show="visible" @click.stop="visible = false">
      <span v-text="message"></span>
    </div>
  </transition>
</template>

<script>
  export default {
    props: {
      message: {
        type: String,
        default: ''
      }
    },
    data() {
      return {
        visible: false
      };
    }
  };
</script>

<style lang="scss" scoped>
  .top-tip {
    position: fixed;
    left: 50%;
    top: 0;
    width: 100%;
    z-index: 500;
    padding: .36rem 0;
    background: $color-dialog-background;
    text-align: center;
    backface-visibility: hidden;
    transform: translate3d(-50%, 0, 0);
    transition: transform .3s ease-out;
    &.drop-enter, &.drop-leave-to {
      transform: translate3d(-50%, -100%, 0);
    }
    span {
      font-size: $font-size-medium;
      color: $color-text;
    }
  }
</style>
