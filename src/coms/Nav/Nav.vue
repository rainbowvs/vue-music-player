<template>
  <ul class="nav">
    <router-link tag="li" class="nav-item" to="/recommend">
      <span>推荐</span>
    </router-link>
    <router-link tag="li" class="nav-item" to="/singer">
      <span>歌手</span>
    </router-link>
    <router-link tag="li" class="nav-item" to="/rank">
      <span>排行</span>
    </router-link>
    <router-link tag="li" class="nav-item" to="/search">
      <span>搜索</span>
    </router-link>
  </ul>
</template>

<script>
  export default {};
</script>

<style lang="scss" scoped>
  .nav {
    @include flex(row);
    width: 100%;
    height: .88rem;
    font-size: $font-size-medium-x;
    .nav-item {
      flex: 1;
      text-align: center;
      &.router-link-active {
        span {
          color: $color-theme;
          border-bottom: 2px solid $color-theme;
        }
      }
      span {
        padding-bottom: .05rem;
        color: $color-text-l;
      }
    }
  }
</style>
