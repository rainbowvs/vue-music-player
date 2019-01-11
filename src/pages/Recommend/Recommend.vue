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
              :key="item.id"
            >
              <div class="poster" v-lazy:background-image="item.picUrl"></div>
              <div class="text">
                <h3 class="name" v-text="item.songListAuthor"></h3>
                <p class="desc" v-text="item.songListDesc"></p>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </scroll>
  </div>
</template>

<script>
  import Scroll from 'coms/Scroll/Scroll';
  import Carousel from 'coms/Carousel/Carousel';
  import Loading from 'coms/Loading/Loading';
  import { requestRecommend } from 'api/recommend';
  import { REQ_OK } from 'api/config';
  export default {
    mounted() {
      this.getRecommend();
    },
    data() {
      return {
        sliders: [],
        discList: []
      };
    },
    methods: {
      getRecommend() {
        requestRecommend().then(res => {
          if (res.code === REQ_OK) {
            this.sliders = res.data.slider;
            this.discList = res.data.songList;
          }
        });
      },
      selectItem(item) {
        this.$router.push({
          path: `/recommend/${item.id}`
        });
      }
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
