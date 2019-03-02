<template>
  <div class="m-header">
    <div class="logo"></div>
    <h1 class="title">Chicken Music</h1>
    <router-link to="/user" class="mine">
      <i class="music-icon icon-mine"></i>
    </router-link>
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
    .mine {
      position: absolute;
      top: 0;
      right: 0;
      .icon-mine {
        display: block;
        padding: .24rem;
        font-size: .4rem;
        color: $color-theme;
      }
    }
  }
</style>
