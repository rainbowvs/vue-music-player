<template>
  <div class="recommend">
    <scroll ref="scroll">
      <div class="scroll-content">
        <div class="carousel-box">
          <div class="carousel">
            <Carousel v-if="sliders.length">
              <div v-for="item in sliders" :key="item.id">
                <a :href="item.linkUrl">
                  <img :src="item.picUrl">
                </a>
              </div>
            </Carousel>
          </div>
        </div>
        <div class="hot-list">
          <h2 class="list-title">热门歌单推荐</h2>
          <div class="loading-container" v-if="!discList.length">
            <loading />
          </div>
          <ul>
            <li
              @click="selectItem(item)"
              v-for="item in discList"
              class="item"
              :key="item.dissid"
            >
              <div class="poster" v-lazy:background-image="item.imgurl"></div>
              <div class="text">
                <h3 class="name" v-text="item.creator.name"></h3>
                <p class="desc" v-text="item.dissname"></p>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </scroll>
    <router-view />
  </div>
</template>

<script>
  import { mapMutations } from 'vuex';
  import Scroll from 'coms/Scroll/Scroll';
  import Carousel from 'coms/Carousel/Carousel';
  import Loading from 'coms/Loading/Loading';
  import { requestRecommend, requestDiscList } from 'api/recommend';
  import { REQ_STATE } from 'api/config';
  import { playListMixin } from 'assets/js/mixin';
  const docEl = document.documentElement;
  const { fontSize } = docEl.style;
  export default {
    mixins: [playListMixin],
    mounted() {
      this.getRecommend();
      this.getDiscList();
    },
    data() {
      return {
        sliders: [],
        discList: []
      };
    },
    methods: {
      handlePlayList(playList) {
        // mixin 解决miniPlayer占位bug
        const bottom = playList.length > 0 ? parseFloat(fontSize) * 1.2 : 0;
        this.$refs.scroll.$el.style.bottom = `${bottom}px`;
        this.$refs.scroll.refresh();
      },
      getRecommend() {
        requestRecommend().then(res => {
          if (res.code === REQ_STATE.OK) {
            this.sliders = res.data.slider;
          }
        });
      },
      getDiscList() {
        requestDiscList().then(res => {
          if (res.code === REQ_STATE.OK) {
            this.discList = res.data.list;
          }
        });
      },
      selectItem(item) {
        this.setDisc(item);
        this.$router.push({
          path: `/recommend/${item.dissid}`
        });
      },
      ...mapMutations({
        setDisc: 'SET_DISC'
      })
    },
    components: {
      Scroll,
      Carousel,
      Loading
    }
  };
</script>

<style lang="scss" scoped>
  .recommend {
    position: relative;
    width: 100%;
    flex: 1;
    .carousel-box {
      position: relative;
      width: 100%;
      padding-top: 40%;
      height: 0;
      overflow: hidden;
      .carousel {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
      }
    }
    .hot-list {
      .list-title {
        margin: 0;
        height: 1rem;
        line-height: 1rem;
        text-align: center;
        font-size: $font-size-medium-x;
        font-weight: normal;
        color: $color-theme;
      }
      .item {
        @include flex(row, flex-start);
        box-sizing: border-box;
        padding: 0 .4rem .5rem .4rem;
        .poster {
          flex-shrink: 0;
          width: 1.2rem;
          height: 1.2rem;
          background-repeat: no-repeat;
          background-size: contain;
          background-position: center;
          margin-right: .4rem;
        }
        .text {
          @include flex(column, space-around, flex-start);
          height: 1.2rem;
          .name {
            font-size: $font-size-medium-x;
            font-weight: normal;
            margin: 0;
            color: $color-text;
          }
          .desc {
            font-size: $font-size-medium;
            margin: 0;
            color: $color-text-d;
          }
        }
      }
    }
  }
</style>
