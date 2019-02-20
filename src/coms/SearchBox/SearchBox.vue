<template>
  <div class="search-box">
    <i class="music-icon icon-search"></i>
    <input
      ref="query"
      class="box"
      v-model="query"
      :placeholder="placeholder"
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
        default: '搜索歌曲丶歌手'
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
      },
      setQuery(query) {
        this.query = query;
      }
    }
  };
</script>

<style lang="scss" scoped>
  .search-box {
    @include flex(row);
    box-sizing: border-box;
    width: 100%;
    padding: 0 .12rem;
    height: .8rem;
    background: $color-highlight-background;
    border-radius: 6px;
    .icon-search {
      font-size: .48rem;
      color: $color-text-d;
    }
    .box {
      flex: 1;
      margin: 0 .1rem;
      padding: 0;
      height: 100%;
      line-height: .36rem;
      background: $color-highlight-background;
      color: $color-text;
      font-size: $font-size-medium;
      &::placeholder {
        color: $color-text-d;
      }
    }
    .icon-dismiss {
      font-size: .32rem;
      color: $color-background;
    }
  }
</style>
