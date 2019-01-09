<template>
  <div id="app">
    <m-header />
    <tab></tab>
    <router-view />
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

</style>
