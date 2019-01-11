<template>
  <div class="list-view">
    <scroll
      ref="scroll"
      :listenScroll="listenScroll"
      :probeType="probeType"
      @scroll="scroll"
    >
      <div class="scroll-content">
        <div class="loading-container" v-if="!data.length">
          <loading />
        </div>
        <ul>
          <li
            class="list-group"
            ref="listGroup"
            v-for="(group, i) in data"
            :key="i"
          >
            <h2 class="list-group-title">{{group.title}}</h2>
            <ul>
              <li
                class="list-group-item"
                v-for="(item, i) in group.items"
                @click="selectItem(item)"
                :key="i"
              >
                <div class="avatar" v-lazy:background-image="item.avatar"></div>
                <span class="name">{{item.name}}</span>
              </li>
            </ul>
          </li>
        </ul>
      </div>
    </scroll>
    <div
      class="list-shortcut"
      @touchstart="onShortcutTouchStart"
      @touchmove.stop.prevent="onShortcutTouchMove"
    >
      <ul>
        <li
          class="item"
          v-for="(item, index) in shortcutList"
          :data-index="index"
          :class="{'current': currentIndex === index}"
          :key="index"
        >
          {{item}}
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
  import Scroll from 'coms/Scroll/Scroll';
  import Loading from 'coms/Loading/Loading';
  import { getData } from 'assets/js/dom';
  export default {
    props: {
      data: {
        type: Array,
        default: () => []
      }
    },
    created() {
      this.touch = {}; // 共享touch事件属性
      this.listenScroll = true; // 监听scroll事件开关
      this.listHeight = []; // listGroup区间数组
      this.probeType = 3; // BS派发scroll事件不节流
    },
    data() {
      return {
        scrollY: -1, // 滚动距离，依赖scroll事件pos.y属性
        currentIndex: 0 // 快捷菜单高亮索引
      };
    },
    methods: {
      scroll (pos) {
        this.scrollY = pos.y;
      },
      calculateHeight() {
        // 计算listHeight
        const list = this.$refs.listGroup;
        let height = 0;
        this.listHeight = [];
        this.listHeight.push(height);
        for (let i = 0, len = list.length; i < len; i++) {
          let item = list[i];
          height += item.offsetHeight;
          this.listHeight.push(height); // [0, 第一个listGroup区间上限, 第二个listGroup区间上限]
        }
      },
      onShortcutTouchStart(e) {
        // 快捷菜单touchStart
        const anchorIndex = getData(e.target, 'index');
        const firstTouch = e.touches[0];
        this.touch.anchorIndex = +anchorIndex;
        this.touch.y1 = firstTouch.pageY;
        this._scrollToElement(anchorIndex);
      },
      onShortcutTouchMove(e) {
        // 快捷菜单touchMove
        const firstTouch = e.touches[0];
        this.touch.y2 = firstTouch.pageY;
        const ANCHOR_HEIGHT = parseFloat(document.documentElement.style.fontSize) * 0.36; // rem精确浮点数
        const delta = (this.touch.y2 - this.touch.y1) / ANCHOR_HEIGHT | 0; // | 转换为二进制后再进行运算，浮点型运算时相当于向下取整
        const anchorIndex = this.touch.anchorIndex + delta;
        this._scrollToElement(anchorIndex);
      },
      _scrollToElement(index) {
        // 根据快捷touch事件返回的index计算滚动位置
        const listHeight = this.listHeight;
        if (index === null) {
          // 顶部和尾部UI占位
          return;
        } else if (index < 0) {
          // 往上滑动超出顶部
          index = 0;
        } else if (index > listHeight.length - 2) {
          // 往下滑动超出底部
          index = listHeight.length - 2;
        }

        // 点击快捷索引无法高亮：currentIndex依赖scrollY，scrollY依赖scroll事件的pos.y，但scrollToElement不会派发scroll事件
        this.scrollY = -listHeight[index];
        this.$refs.scroll.scrollToElement(this.$refs.listGroup[index], 0);
      },
      selectItem() {

      }
    },
    watch: {
      data() {
        // 监听父组件传入的列表数据data
        setTimeout(() => {
          this.calculateHeight();
        }, 20);
      },
      scrollY(newY) {
        const listHeight = this.listHeight;

        // 当滚动超出顶部，newY > 0
        if (newY > 0) {
          this.currentIndex = 0;
          return;
        }

        // 在中间部分滚动
        for (let i = 0, len = listHeight.length; i < len; i++) {
          const h1 = listHeight[i];
          const h2 = listHeight[i + 1];
          const Y = Math.abs(newY);
          if (Y >= h1 && Y < h2) {
            this.currentIndex = i;
            return;
          }
        }

        //当滚动超出底部，Y > 最后一个元素
        this.currentIndex = listHeight.length - 2;
      }
    },
    computed: {
      shortcutList() {
        return this.data.map(group => {
          return group.title.substring(0, 1);
        });
      }
    },
    components: {
      Scroll,
      Loading
    }
  };
</script>

<style lang="scss" scoped>
  .list-view {
    position: relative;
    height: 100%;
    .list-group {
      padding-bottom: .6rem;
      .list-group-title {
        @include flex(row, flex-start);
        margin: 0;
        height: .6rem;
        padding-left: .6rem;
        font-weight: normal;
        font-size: $font-size-medium;
        color: $color-text-l;
        background: $color-highlight-background;
      }
      .list-group-item {
        @include flex(row, flex-start);
        padding: .4rem 0 0 .6rem;
        .avatar {
          width: 1rem;
          height: 1rem;
          border-radius: 50%;
          background-repeat: no-repeat;
          background-size: contain;
          background-position: center;
        }
        .name {
          margin-left: .4rem;
          color: $color-text-l;
          font-size: $font-size-medium-x;
        }
      }
    }
    .list-shortcut {
      position: absolute;
      z-index: 30;
      right: 0;
      top: 50%;
      transform: translateY(-50%);
      width: .4rem;
      padding: .4rem 0;
      border-radius: 10px;
      background: $color-background-d;
      font-family: Helvetica;
      .item {
        @include flex(row);
        /* min-height: .24rem; */
        height: .36rem;
        color: $color-text-l;
        font-size: $font-size-small-x;
        &.current {
          color: $color-theme;
        }
      }
    }
    .list-fixed {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      .fixed-title {
        height: .6rem;
        line-height: .6rem;
        padding-left: .4rem;
        font-size: $font-size-small;
        color: $color-text-l;
        background: $color-highlight-background;
      }
    }
  }
</style>
