<template>
  <div id="app">
    <m-header />
    <router-view />
  </div>
</template>

<script>
  import MHeader from 'coms/MHeader/MHeader';
  export default {
    components: {
      MHeader
    }
  };
</script>

<style lang="scss" scoped>

</style>
