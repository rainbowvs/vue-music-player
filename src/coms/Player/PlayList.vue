<template>
  <transition name="list-fade">
    <div class="play-list" v-show="showFlag" @click.self="hide">
      <div class="list-wrapper">
        <div class="list-header">
          <h1 class="title">
            <i :class="`icon music-icon ${modeIcon}`" @click="changeMode"></i>
            <span class="text" v-text="modeText" @click="changeMode"></span>
            <span class="clear" @click="showConfirm">
              <i class="music-icon icon-clear"></i>
            </span>
          </h1>
        </div>
        <scroll ref="scroll" class="list-content" :data="sequenceList">
          <transition-group ref="list" name="list" tag="ul">
            <li
              class="item"
              v-for="(item, index) in sequenceList"
              :key="item.id"
              @click="selectItem(item, index)"
            >
              <i :class="`current ${getCurrentIcon(item)}`"></i>
              <span class="text" v-text="item.name"></span>
              <span class="like" @click.stop="toggleFavorite(item)">
                <i :class="`music-icon ${favoriteIcon(item)}`"></i>
              </span>
              <span class="delete" @click.stop="deleteOne(item)">
                <i class="music-icon icon-delete"></i>
              </span>
            </li>
          </transition-group>
        </scroll>
        <div class="list-operate">
          <div class="add" @click="showAddSong">
            <i class="music-icon icon-add"></i>
            <span class="text">添加歌曲到队列</span>
          </div>
        </div>
        <div @click="hide" class="list-close">
          <span>关闭</span>
        </div>
      </div>
      <confirm
        ref="confirm"
        text="是否清空播放列表"
        confirmBtnText="清空"
        @confirm="clearConfirm"
      />
      <add-song ref="addSong" />
    </div>
  </transition>
</template>

<script>
  import { mapGetters, mapMutations, mapActions } from 'vuex';
  import Scroll from 'coms/Scroll/Scroll';
  import Confirm from 'coms/Confirm/Confirm';
  import AddSong from './AddSong';
  import { playMode } from 'store/config';
  import { playerMixin } from 'assets/js/mixin';
  export default {
    mixins: [playerMixin],
    data() {
      return {
        showFlag: false
      };
    },
    methods: {
      showAddSong() {
        this.$refs.addSong.show();
      },
      clearConfirm() {
        this.clearSongList();
        this.hide();
      },
      showConfirm() {
        this.$refs.confirm.show();
      },
      deleteOne(item) {
        this.deleteSong(item);
        if (!this.playList.length) {
          // 播放列表没有歌曲时隐藏
          this.hide();
        }
      },
      scrollToCurrent(current) {
        const index = this.sequenceList.findIndex(v => {
          return v.id === current.id;
        });
        this.$refs.scroll.scrollToElement(this.$refs.list.$el.children[index], 300);
      },
      selectItem(item, index) {
        let newIndex = index;
        if (this.mode === playMode.random) {
          newIndex = this.playList.findIndex(v => {
            return v.id === item.id;
          });
        }
        this.setCurrentIndex(newIndex);
        this.setPlayingState(true); // 防止暂停时切换歌曲导致播放状态bug
      },
      getCurrentIcon(item) {
        if (this.currentSong.id === item.id) {
          return 'music-icon icon-play';
        }
        return '';
      },
      show() {
        this.showFlag = true;
        this.$nextTick(() => {
          this.$refs.scroll.refresh();
          this.scrollToCurrent(this.currentSong);
        });
      },
      hide() {
        this.showFlag = false;
      },
      ...mapMutations({
        setCurrentIndex: 'SET_CURRENT_INDEX',
        setPlayingState: 'SET_PLAYING_STATE'
      }),
      ...mapActions([
        'deleteSong',
        'clearSongList'
      ])
    },
    computed: {
      modeText() {
        return this.mode === playMode.sequence
        ? '顺序播放'
        : this.mode === playMode.loop
        ? '单曲循环'
        : '随机播放';
      },
      ...mapGetters([
        'sequenceList',
        'currentSong',
        'mode',
        'playList'
      ])
    },
    watch: {
      currentSong(newVal, oldVal) {
        if (!this.showFlag || newVal.id === oldVal.id) {
          return;
        }
        this.$nextTick(() => {
          this.scrollToCurrent(newVal);
        });
      }
    },
    components: {
      Scroll,
      Confirm,
      AddSong
    }
  };
</script>

<style lang="scss" scoped>
  .play-list {
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    z-index: 200;
    background-color: $color-background-d;
    &.list-fade-enter-active, &.list-fade-leave-active {
      transition: opacity 0.3s;
      .list-wrapper {
        transition: all 0.3s;
      }
    }
    &.list-fade-enter, &.list-fade-leave-to {
      opacity: 0;
      .list-wrapper {
        transform: translate3d(0, 100%, 0);
      }
    }
    .list-wrapper {
      position: absolute;
      left: 0;
      bottom: 0;
      width: 100%;
      background-color: $color-highlight-background;
      .list-header {
        position: relative;
        padding: .4rem .6rem .2rem .4rem;
        .title {
          margin: 0;
          font-weight: normal;
          @include flex(row);
          .icon {
            margin-right: .2rem;
            font-size: .6rem;
            color: $color-theme-d;
          }
          .text {
            flex: 1;
            font-size: $font-size-medium;
            color: $color-text-l;
          }
          .clear {
            @include extend-click();
            .icon-clear {
              font-size: $font-size-medium;
              color: $color-text-d;
            }
          }
        }
      }
      .list-content {
        max-height: 4.8rem;
        overflow: hidden;
        .item {
          @include flex(row);
          height: .8rem;
          padding: 0 .6rem 0 .4rem;
          overflow: hidden;
          &.list-enter-active, &.list-leave-active {
            transition: all 0.1s;
          }
          &.list-enter, &.list-leave-to {
            height: 0;
          }
          .current {
            flex: 0 0 .4rem;
            width: .4rem;
            font-size: $font-size-small;
            color: $color-theme-d;
          }
          .text {
            @include ellipsis();
            flex: 1;
            font-size: $font-size-medium;
            color: $color-text-d;
          }
          .like {
            @include extend-click();
            margin-right: .3rem;
            font-size: $font-size-small;
            color: $color-theme;
            .icon-favorite {
              color: $color-sub-theme;
            }
          }
          .delete {
            @include extend-click();
            font-size: $font-size-small;
            color: $color-theme;
          }
        }
      }
      .list-operate {
        width: 2.8rem;
        margin: .4rem auto .6rem auto;
        .add {
          @include flex(row);
          padding: .16rem .32rem;
          border: 1px solid $color-text-l;
          border-radius: 100px;
          color: $color-text-l;
          .icon-add {
            margin-right: .1rem;
            font-size: $font-size-small-x;
          }
          .text {
            font-size: $font-size-small;
          }
        }
      }
      .list-close {
        text-align: center;
        line-height: 1rem;
        background: $color-background;
        font-size: $font-size-medium-x;
        color: $color-text-l;
      }
    }
  }
</style>
