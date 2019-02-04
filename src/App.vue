<template>
  <div id="app">
    <m-header />
    <tab></tab>
    <keep-alive>
      <router-view />
    </keep-alive>
    <player></player>
  </div>
</template>

<script>
  import Player from 'coms/Player/Player';
  import MHeader from 'coms/MHeader/MHeader';
  import Tab from 'coms/Tab/Tab';
  export default {
    components: {
      MHeader,
      Tab,
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
