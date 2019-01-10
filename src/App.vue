<template>
  <div id="app">
    <m-header />
    <tab></tab>
    <keep-alive>
      <router-view />
    </keep-alive>
  </div>
</template>

<script>
  import MHeader from 'coms/MHeader/MHeader';
  import Tab from 'coms/Tab/Tab';
  export default {
    components: {
      MHeader,
      Tab
    }
  };
</script>

<style lang="scss" scoped>
  #app {
    @include flex(column, flex-start);
    height: 100%;
  }
</style>
