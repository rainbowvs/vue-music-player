<template>
  <div class="loading">
    <div class="box"></div>
    <p v-text="title"></p>
  </div>
</template>

<script>
  export default {
    props: {
      title: {
        type: String,
        default: '正在载入...'
      }
    }
  };
</script>

<style lang="scss" scoped>
  .loading {
    @include flex(column, space-around);
    width: 100%;
    height: 1.5rem;
    .box {
      @include border(3, $color-text, top right bottom left);
      animation: animate 1s linear infinite;
      width: .5rem;
      height: .5rem;
    }
    p {
      margin: 0;
      color: $color-text;
    }
  }

  @keyframes animate {
    0% {
      background-color: $color-theme;
      transform: rotate(0);
    }
    50% {
      background-color: $color-sub-theme;
      transform: rotate(360deg);
    }
    100% {
      background-color: $color-background;
      transform: rotate(270deg);
    }
  }
</style>
