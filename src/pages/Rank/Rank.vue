<template>
  <div class="rank" ref="rank">
    <scroll class="toplist" ref="scroll">
      <ul>
        <div class="loading-container" v-if="!topList.length">
          <loading />
        </div>
        <li
          class="item"
          v-for="item in topList"
          :key="item.id"
          @click="selectItem(item)"
        >
          <div class="poster" v-lazy:background-image="item.picUrl"></div>
          <ul class="song-list">
            <li class="song" v-for="(song, index) in item.songList" :key="song.songname">
              <span v-text="index + 1"></span>
              <span v-text="`${song.songname}-${song.singername}`"></span>
            </li>
          </ul>
        </li>
      </ul>
    </scroll>
    <router-view />
  </div>
</template>

<script>
  import { mapMutations } from 'vuex';
  import Scroll from 'coms/Scroll/Scroll';
  import Loading from 'coms/Loading/Loading';
  import { requestTopList } from 'api/rank';
  import { REQ_STATE } from 'api/config';
  import { playListMixin } from 'assets/js/mixin';
  const docEl = document.documentElement;
  const { fontSize } = docEl.style;
  export default {
    mixins: [playListMixin],
    data() {
      return {
        topList: []
      };
    },
    created() {
      this.getTopList();
    },
    methods: {
      selectItem(item) {
        this.setRank(item);
        this.$router.push(`/rank/${item.id}`);
      },
      handlePlayList(playList) {
        // mixin 解决miniPlayer占位bug
        const bottom = playList.length > 0 ? parseFloat(fontSize) * 1.2 : 0;
        this.$refs.rank.style.bottom = `${bottom}px`;
        this.$refs.scroll.refresh();
      },
      getTopList() {
        requestTopList().then(res => {
          if (res.code === REQ_STATE.OK) {
            this.topList = res.data.topList;
          }
        });
      },
      ...mapMutations({
        setRank: 'SET_RANK'
      })
    },
    components: {
      Scroll,
      Loading
    }
  };
</script>


<style lang="scss" scoped>
  .rank {
    position: fixed;
    width: 100%;
    top: 1.76rem;
    bottom: 0;
    &> .toplist {
      height: 100%;
      overflow: hidden;
    }
    .item {
      @include flex(row, flex-start);
      margin: 0 .4rem;
      padding-top: .4rem;
      height: 2rem;
      &:last-child {
        padding-bottom: .4rem;
      }
      .poster {
        width: 2rem;
        height: 2rem;
        background-repeat: no-repeat;
        background-size: contain;
        background-position: center;
      }
      .song-list {
        @include flex(column, center, stretch);
        flex: 1;
        padding: 0 .4rem;
        height: 2rem;
        overflow: hidden;
        background: $color-highlight-background;
        color: $color-text-d;
        font-size: $font-size-small-x;
        .song {
          @include ellipsis();
          line-height: .52rem;
        }
      }
    }
  }

</style>
