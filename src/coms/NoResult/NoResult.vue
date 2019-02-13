<template>
  <div class="no-result">
    <div class="no-result-icon"></div>
    <p class="no-result-text">{{title}}</p>
  </div>
</template>

<script>
  export default {
    props: {
      title: {
        type: String,
        default: '暂无搜索结果'
      }
    }
  };
</script>

<style lang="scss" scoped>
  .no-result {
    text-align: center;
    .no-result-icon {
      @include bg-image('~assets/img/no-result');
      width: 1.72rem;
      height: 1.8rem;
      margin: 0 auto;
    }
    .no-result-text {
      margin-top: .6rem;
      font-size: $font-size-medium-x;
      color: $color-text-d;
    }
  }
</style>
