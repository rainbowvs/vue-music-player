<template>
  <div class="search-bar">
    <div class="ph">
      <i class="music-icon icon-search"></i>
      <span class="placeholder" v-text="placeholder" :style="{visibility}"></span>
    </div>
    <input
      type="search"
      ref="query"
      class="search-input"
      v-model.trim="query"
    />
    <i @click="clear" v-show="query" class="music-icon icon-dismiss"></i>
  </div>
</template>

<script>
  import { debounce } from 'assets/js/utils';
  export default {
    props: {
      placeholder: {
        type: String,
        default: '搜索歌曲、歌手'
      }
    },
    data() {
      return {
        query: ''
      };
    },
    created() {
      this.$watch('query', debounce(newVal => {
        this.$emit('query', newVal);
      }, 200));
    },
    methods: {
      blur() {
        this.$refs.query.blur();
      },
      clear() {
        this.query = '';
        this.$refs.query.focus();
      },
      setQuery(query) {
        this.query = query;
      }
    },
    computed: {
      visibility() {
        return this.query === '' ? 'visible' : 'hidden';
      }
    }
  };
</script>

<style lang="scss" scoped>
  $height: .8rem;
  $searchIconWidth: .7rem;
  $clearIconWidth: .6rem;
  .search-bar {
    @include flex(row);
    position: relative;
    box-sizing: border-box;
    width: 100%;
    height: $height;
    background: $color-highlight-background;
    border-radius: 6px;
    overflow: hidden;
    .ph {
      pointer-events: none;
      position: absolute;
      left: 0;
      top: 0;
      height: $height;
      line-height: $height;
      .icon-search {
        display: inline-block;
        width: $searchIconWidth;
        text-align: center;
        font-size: .48rem;
        color: $color-text-d;
        vertical-align: -.12rem;
      }
      .placeholder {
        margin-left: -.09rem;
        color: $color-text-d;
        font-size: $font-size-medium;
      }
    }
    .search-input {
      flex: 1;
      height: $height;
      padding: 0 $clearIconWidth 0 $searchIconWidth;
      background: $color-highlight-background;
      color: $color-text;
      font-size: $font-size-medium;
      &::-webkit-search-cancel-button {
        display: none;
      }
    }
    .icon-dismiss {
      @include extend-click(0);
      text-align: center;
      position: absolute;
      right: 0;
      top: 50%;
      transform: translate(0, -50%);
      width: $clearIconWidth;
      font-size: .32rem;
      color: $color-background;
    }
  }
</style>
