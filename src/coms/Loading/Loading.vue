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
      @include border(3, $color-text, top right bottom);
      animation: rotate .5s linear infinite;
      width: .5rem;
      height: .5rem;
    }
    p {
      margin: 0;
      color: $color-text;
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
