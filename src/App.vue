<template>
  <div id="app">
    <m-header />
    <Nav></Nav>
    <keep-alive>
      <router-view />
    </keep-alive>
    <player></player>
  </div>
</template>

<script>
  import Player from 'coms/Player/Player';
  import MHeader from 'coms/MHeader/MHeader';
  import Nav from 'coms/Nav/Nav';
  export default {
    components: {
      MHeader,
      Nav,
      Player
    }
  };
</script>

<style lang="scss" scoped>
  #app {
    @include flex(column, flex-start);
    height: 100%;
  }
</style>
