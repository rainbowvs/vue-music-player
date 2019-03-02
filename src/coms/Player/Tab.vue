<template>
  <ul class="tabs">
    <li
      class="item"
      v-for="(item, index) in tabs"
      :key="item.name"
      :class="{'active': currentIndex === index}"
      @click="change(index)"
    >
      <span v-text="item.name"></span>
    </li>
  </ul>
</template>

<script>
  export default {
    props: {
      tabs: {
        type: Array,
        default: () => []
      },
      currentIndex: {
        type: Number,
        default: 0
      }
    },
    methods: {
      change(index) {
        this.$emit('change', index);
      }
    }
  };
</script>

<style lang="scss" scoped>
  .tabs {
    @include flex(row);
    width: 4.8rem;
    margin: 0 auto;
    @include border(1, $color-highlight-background, null, 5px);
    border-radius: 5px;
    overflow: hidden;
    .item {
      flex: 1;
      padding: .16rem;
      text-align: center;
      font-size: $font-size-medium;
      color: $color-text-d;
      &.active {
        background: $color-highlight-background;
        color: $color-text;
      }
    }
  }
</style>
