<template>
  <div class="song-list">
    <ul>
      <li
        class="item"
        v-for="(song, index) in songs"
        :key="index"
        @click="selectItem(song, index)"
      >
        <div class="rank" v-show="rank">
          <span
            v-text="getRankText(index)"
            :class="getRankCls(index)"
          ></span>
        </div>
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
      },
      rank: {
        type: Boolean,
        default: false
      }
    },
    methods: {
      getRankCls(index) {
        if (index <= 2) {
          return `icon icon${index}`;
        } else {
          return 'text';
        }
      },
      getRankText(index) {
        if (index > 2) {
          return index + 1;
        }
      },
      selectItem(item, index) {
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
      .rank {
        width: .5rem;
        margin-right: .6rem;
        text-align: center;
        .icon {
          display: inline-block;
          width: .5rem;
          height: .48rem;
          background-size: .5rem .48rem;
          &.icon0 {
            @include bg-image('~assets/img/first');
          }
          &.icon1 {
            @include bg-image('~assets/img/second');
          }
          &.icon2 {
            @include bg-image('~assets/img/third');
          }
        }
        .text {
          color: $color-theme;
          font-size: $font-size-large;
        }
      }
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

