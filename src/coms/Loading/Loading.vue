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
        default: '正在加载...'
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
      animation: animate 1s linear infinite;
      background-color: $color-theme;
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
      transform: rotate(0);
    }
    50% {
      transform: rotate(360deg);
    }
    100% {
      transform: rotate(270deg);
    }
  }
</style>
