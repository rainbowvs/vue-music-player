<template>
  <div class="song-list">
    <ul>
      <li
        class="item"
        v-for="(song, index) in songs"
        :key="index"
        @click="selectItem(song, index)"
      >
        <div class="content">
          <h2 class="name">{{song.name}}</h2>
          <p class="desc">{{getDesc(song)}}</p>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
  export default {
    props: {
      songs: {
        type: Array,
        default: () => []
      }
    },
    methods: {
      selectItem (item, index) {
        this.$emit('select', item, index);
      },
      getDesc(song) {
        return `${song.singer} · ${song.album}`;
      }
    }
  };
</script>

<style lang="scss" scoped>
  .song-list {
    .item {
      @include flex(row, flex-start);
      box-sizing: border-box;
      height: 1.28rem;
      .content {
        flex: 1;
        line-height: .4rem;
        overflow: hidden;
        .name {
          @include ellipsis();
          margin: 0;
          font-size: $font-size-medium-x;
          font-weight: normal;
          color: $color-text;
        }
        .desc {
          @include ellipsis();
          margin-top: .08rem;
          color: $color-text-d;
          font-size: $font-size-medium;
        }
      }
    }
  }
</style>

