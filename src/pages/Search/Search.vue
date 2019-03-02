<template>
  <div class="search">
    <div class="search-bar-wrapper">
      <search-bar ref="searchBar" @query="onQueryChange" />
    </div>
    <div ref="shortcut" class="shortcut-wrapper" v-show="!query">
      <scroll ref="scroll" class="shortcut" :dataList="shortcut">
        <div>
          <div class="hot-key">
            <h1 class="title">热门搜索</h1>
            <ul>
              <li
                class="item"
                v-for="item in hotKey"
                :key="item.n"
                @click="addQuery(item.k)"
              >
                <span v-text="item.k"></span>
              </li>
            </ul>
          </div>
          <div class="search-history" v-show="searchHistory.length">
            <h1 class="title">
              <span class="text">搜索历史</span>
              <span class="clear" @click="showConfirm">
                <i class="music-icon icon-clear"></i>
              </span>
            </h1>
            <search-list
              :searches="searchHistory"
              @select="addQuery"
              @delete="deleteSearchHistory"
            ></search-list>
          </div>
        </div>
      </scroll>
    </div>
    <div class="search-result" v-show="query" ref="searchResult">
      <suggest
        ref="suggest"
        :query="query"
        @listBeforeScroll="blurInput"
        @select="saveSearchHistory(query)"
      ></suggest>
    </div>
    <confirm
      ref="confirm"
      text="是否清空所有搜索历史"
      confirmBtnText="清空"
      @confirm="clearSearchHistory"
    />
    <router-view />
  </div>
</template>

<script>
  import { mapActions, mapGetters } from 'vuex';
  import Scroll from 'coms/Scroll/Scroll';
  import SearchBar from 'coms/SearchBar/SearchBar';
  import Suggest from 'coms/Suggest/Suggest';
  import SearchList from 'coms/SearchList/SearchList';
  import Confirm from 'coms/Confirm/Confirm';
  import { requestHotKey } from 'api/search';
  import { REQ_STATE } from 'api/config';
  import { playListMixin, searchMixin } from 'assets/js/mixin';
  const docEl = document.documentElement;
  const { fontSize } = docEl.style;
  export default {
    mixins: [playListMixin, searchMixin],
    data() {
      return {
        hotKey: []
      };
    },
    created() {
      this.getHotKey();
    },
    methods: {
      handlePlayList(playList) {
        // mixin 解决miniPlayer占位bug
        const bottom = playList.length > 0 ? parseFloat(fontSize) * 1.2 : 0;
        this.$refs.shortcut.style.bottom = `${bottom}px`;
        this.$refs.searchResult.style.bottom = `${bottom}px`;
        this.$refs.scroll.refresh();
        this.$refs.suggest.refresh();
      },
      showConfirm() {
        this.$refs.confirm.show();
      },
      getHotKey() {
        requestHotKey().then(res => {
          if (res.code === REQ_STATE.OK) {
            this.hotKey = res.data.hotkey.slice(0, 10);
          }
        });
      },
      ...mapActions([
        'clearSearchHistory'
      ])
    },
    watch: {
      query(newVal) {
        if (!newVal) {
          // 重新添加歌曲达到可滚动状态需refresh
          this.$nextTick(() => {
            this.$refs.scroll.refresh();
          });
        }
      }
    },
    computed: {
      shortcut() {
        // 便于scroll组件重新计算高度
        return this.hotKey.concat(this.searchHistory);
      },
      ...mapGetters([
        'searchHistory'
      ])
    },
    components: {
      Scroll,
      SearchBar,
      Suggest,
      SearchList,
      Confirm
    }
  };
</script>

<style lang="scss" scoped>
  .search {
    position: fixed;
    width: 100%;
    top: 1.76rem;
    bottom: 0;
    .search-bar-wrapper {
      margin: .4rem;
    }
    .shortcut-wrapper {
      position: fixed;
      top: 3.56rem;
      bottom: 0;
      width: 100%;
      .shortcut {
        height: 100%;
        overflow: hidden;
        .hot-key {
          margin: 0 .4rem .4rem .4rem;
          .title {
            margin: 0;
            line-height: .8rem;
            font-size: $font-size-medium-x;
            color: $color-text-l;
          }
          .item {
            display: inline-block;
            padding: .1rem .2rem;
            margin: 0 .4rem .2rem 0;
            border-radius: .12rem;
            background: $color-highlight-background;
            font-size: $font-size-medium;
            color: $color-text-d;
          }
        }
        .search-history {
          position: relative;
          margin: 0 .4rem;
          .title {
            @include flex(row, space-between);
            margin: 0;
            height: .8rem;
            .text {
              color: $color-text-l;
              font-size: $font-size-medium-x;
            }
            .clear {
              @include flex(row);
              @include extend-click();
              .icon-clear {
                font-size: $font-size-medium;
                color: $color-text-d;
              }
            }
          }
        }
      }
    }
    .search-result {
      position: fixed;
      width: 100%;
      top: 3.56rem;
      bottom: 0;
      &> .scroll-wrapper {
        height: 100%;
        overflow: hidden;
      }
    }
  }
</style>
