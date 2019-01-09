<template>
  <div class="m-header">
    <div class="logo"></div>
    <h1 class="title">Chicken Music</h1>
  </div>
</template>

<script>
  export default {};
</script>

<style lang="scss" scoped>
  .m-header {
    @include flex(row);
    height: .88rem;
    color: $color-theme;
    .logo {
      @include bg-image('~assets/img/logo');
      margin-right: .18rem;
      width: .6rem;
      height: .64rem;
    }
    .title {
      margin: 0;
      font-size: $font-size-large;
      font-weight: normal;
    }
  }
</style>
