<template>
  <div class="search">
    <div class="search-box-wrapper">
      <search-box ref="searchBox" @query="onQueryChange"></search-box>
    </div>
    <div class="shortcut-wrapper" v-show="!query">
      <div class="shortcut-content">
        <scroll ref="scroll" class="shortcut" :data="shortcut">
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
    </div>
    <div class="search-result" v-show="query" ref="searchResult">
      <div class="suggest-content">
        <suggest
          ref="suggest"
          :query="query"
          @listBeforeScroll="blurInput"
          @select="saveSearchHistory(query)"
        ></suggest>
      </div>
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
  import SearchBox from 'coms/SearchBox/SearchBox';
  import Suggest from 'coms/Suggest/Suggest';
  import SearchList from 'coms/SearchList/SearchList';
  import Confirm from 'coms/Confirm/Confirm';
  import { requestHotKey } from 'api/search';
  import { REQ_STATE } from 'api/config';
  import { playListMixin } from 'assets/js/mixin';
  const docEl = document.documentElement;
  const { fontSize } = docEl.style;
  export default {
    mixins: [playListMixin],
    data() {
      return {
        hotKey: [],
        query: ''
      };
    },
    created() {
      this.getHotKey();
    },
    methods: {
      handlePlayList(playList) {
        // mixin 解决miniPlayer占位bug
        const bottom = playList.length > 0 ? parseFloat(fontSize) * 1.2 : 0;
        this.$refs.scroll.$el.style.bottom = `${bottom}px`;
        this.$refs.suggest.$el.style.bottom = `${bottom}px`;
        this.$refs.scroll.refresh();
        this.$refs.suggest.refresh();
      },
      showConfirm() {
        this.$refs.confirm.show();
      },
      blurInput() {
        this.$refs.searchBox.blur();
      },
      onQueryChange(query) {
        this.query = query;
      },
      addQuery(query) {
        this.$refs.searchBox.setQuery(query);
      },
      getHotKey() {
        requestHotKey().then(res => {
          if (res.code === REQ_STATE.OK) {
            this.hotKey = res.data.hotkey.slice(0, 10);
          }
        });
      },
      ...mapActions([
        'saveSearchHistory',
        'deleteSearchHistory',
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
        return this.hotKey.concat(this.searchHistory);
      },
      ...mapGetters([
        'searchHistory'
      ])
    },
    components: {
      Scroll,
      SearchBox,
      Suggest,
      SearchList,
      Confirm
    }
  };
</script>

<style lang="scss" scoped>
  .search {
    width: 100%;
    flex: 1;
    .search-box-wrapper {
      margin: .4rem;
    }
    .shortcut-wrapper {
      position: fixed;
      top: 3.56rem;
      bottom: 0;
      width: 100%;
      &> .shortcut-content {
        position: relative;
        height: 100%;
      }
      .shortcut {
        position: absolute;
        overflow: hidden;
        .hot-key {
          margin: 0 .4rem .4rem .4rem;
          .title {
            margin-bottom: .4rem;
            font-size: $font-size-medium;
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
            display: flex;
            align-items: center;
            height: .8rem;
            font-size: $font-size-medium;
            color: $color-text-l;
            .text {
              flex: 1;
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
      }
    }
    .search-result {
      position: fixed;
      width: 100%;
      top: 3.56rem;
      bottom: 0;
      &> .suggest-content {
        position: relative;
        height: 100%;
      }
    }
  }
</style>
