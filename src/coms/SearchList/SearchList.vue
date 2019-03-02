<template>
  <div class="search-list">
    <transition-group name="list" tag="ul">
      <li
        class="search-item"
        v-for="item in searches"
        :key="item"
        @click="selectItem(item)"
      >
        <span class="text" v-text="item"></span>
        <i class="music-icon icon-delete" @click.stop="deleteOne(item)"></i>
      </li>
    </transition-group>
  </div>
</template>

<script>
  export default {
    props: {
      searches: {
        type: Array,
        default: () => []
      }
    },
    methods: {
      selectItem(item) {
        this.$emit('select', item);
      },
      deleteOne(item) {
        this.$emit('delete', item);
      }
    }
  };
</script>

<style lang="scss" scoped>
  .search-list {
    .search-item {
      @include flex(row);
      height: .7rem;
      overflow: hidden;
      &.list-enter-active, &.list-leave-active {
        transition: all 0.1s;
      }
      &.list-enter, &.list-leave-to {
        height: 0;
      }
      .text {
        @include ellipsis();
        flex: 1;
        color: $color-text-l;
        font-size: $font-size-medium-x;
      }
      i.icon-delete {
        @include extend-click();
        font-size: $font-size-medium;
        color: $color-text-d;
      }
    }
  }
</style>
