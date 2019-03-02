<template>
  <scroll
    ref="scroll"
    class="suggest"
    :dataList="result"
    :pullup="pullup"
    :beforeScroll="beforeScroll"
    @scrollToEnd="searchMore"
    @beforeScroll="listBeforeScroll"
  >
    <ul class="suggest-list">
      <li
        class="suggest-item"
        v-for="item in result"
        :key="formatKey(item)"
        @click="selectItem(item)"
      >
        <i :class="`icon ${getIconCls(item)}`"></i>
        <p class="text" v-html="getDisplayName(item)"></p>
      </li>
      <loading v-show="hasMore" />
    </ul>
    <div v-show="!hasMore && !result.length" class="no-result-wrapper">
      <no-result />
    </div>
  </scroll>
</template>

<script>
  import { mapMutations, mapActions } from 'vuex';
  import Scroll from 'coms/Scroll/Scroll';
  import Loading from 'coms/Loading/Loading';
  import NoResult from 'coms/NoResult/NoResult';
  import { requestSearch } from 'api/search';
  import { REQ_STATE } from 'api/config';
  import { processSongsUrl, createSong, isValidMusic } from 'assets/js/song';
  import Singer from 'assets/js/singer';
  const TYPE_SINGER = 'singer';
  const perpage = 20;
  export default {
    props: {
      query: {
        type: String,
        default: ''
      },
      showSinger: {
        type: Boolean,
        default: true
      }
    },
    data() {
      return {
        pullup: true,
        page: 1,
        result: [],
        beforeScroll: true,
        hasMore: true
      };
    },
    methods: {
      refresh() {
        this.$refs.scroll.refresh();
      },
      listBeforeScroll() {
        this.$emit('listBeforeScroll');
      },
      selectItem(item) {
        if (item.type === TYPE_SINGER) {
          const singer = new Singer({
            id: item.singermid,
            name: item.singername
          });
          this.setSinger(singer);
          this.$router.push(`/search/${singer.id}`);
        } else {
          this.insertSong(item);
        }
        this.$emit('select', item);
      },
      checkMore({song}) {
        if (!song.list.length || (song.curnum + (song.curpage - 1) * perpage) >= song.totalnum) {
          this.hasMore = false;
        }
      },
      searchMore () {
        if (!this.hasMore || this.isLoading) {
          return;
        }
        this.isLoading = true;
        requestSearch(this.query, this.page + 1, this.showSinger, perpage).then(res => {
          if (res.code === REQ_STATE.OK) {
            this.page++;
            this.genResult(res.data).then(result => {
              this.result = this.result.concat(result);
            });
            this.checkMore(res.data);
          }
          this.isLoading = false;
        });
      },
      formatKey({id, singerid}) {
        return id | singerid;
      },
      getDisplayName(item) {
        if (item.type === TYPE_SINGER) {
          return item.singername;
        } else {
          return `${item.name}-${item.singer}`;
        }
      },
      getIconCls(item) {
        if (item.type === TYPE_SINGER) {
          return 'music-icon icon-mine';
        } else {
          return 'music-icon icon-music';
        }
      },
      normalizeSongs(list) {
        let ret = [];
        list.forEach(v => {
          if (isValidMusic(v)) {
            ret.push(createSong(v));
          }
        });
        return ret;
      },
      genResult(data) {
        let ret = [];
        if (data.zhida && data.zhida.singerid && this.page === 1) {
          ret.push({...data.zhida, ...{type: TYPE_SINGER}});
        }
        return processSongsUrl(this.normalizeSongs(data.song.list)).then(songs => {
          ret = ret.concat(songs);
          return ret;
        });
      },
      getSearch() {
        this.page = 1;
        this.hasMore = true;
        this.isLoading = true;
        this.$refs.scroll.scrollTo(0, 0);
        requestSearch(this.query, this.page, this.showSinger, perpage).then(res => {
          if (res.code === REQ_STATE.OK) {
            this.genResult(res.data).then(result => {
              this.result = result;
            });
            this.checkMore(res.data);
          }
          this.isLoading = false;
        });
      },
      ...mapMutations({
        setSinger: 'SET_SINGER'
      }),
      ...mapActions([
        'insertSong'
      ])
    },
    watch: {
      query(newVal) {
        if (!newVal) {
          return;
        }
        this.getSearch();
      }
    },
    components: {
      Scroll,
      Loading,
      NoResult
    }
  };
</script>

<style lang="scss" scoped>
  .suggest {
    .suggest-list {
      padding: 0 .6rem;
      .suggest-item {
        @include flex(row);
        padding-bottom: .4rem;
      }
      .icon {
        margin-right: .2rem;
        font-size: $font-size-medium-x;
        color: $color-text-ll;
      }
      .text {
        @include ellipsis();
        font-size: $font-size-medium-x;
        color: $color-text-d;
        flex: 1;
        margin: 0;
      }
    }
    .no-result-wrapper {
      position: absolute;
      width: 100%;
      top: 50%;
      transform: translateY(-50%);
    }
  }
</style>
