<template>
  <div class="recommend">
    <scroll ref="scroll">
      <div>
        <div v-if="sliders.length" class="slider-wrapper" ref="sliderWrapper">
          <Carousel :data="sliders">
            <div v-for="item in sliders" :key="item.id">
              <a :href="item.linkUrl">
                <img class="needsclick" @load="loadImage" :src="item.picUrl">
              </a>
            </div>
          </Carousel>
        </div>
      </div>
    </scroll>
  </div>
</template>

<script>
  import Scroll from 'coms/Scroll/Scroll';
  import Carousel from 'coms/Carousel/Carousel';
  import { requestRecommend } from 'api/recommend';
  import { REQ_OK } from 'api/config';
  export default {
    mounted() {
      this.getRecommend();
    },
    data() {
      return {
        sliders: []
      };
    },
    methods: {
      getRecommend() {
        requestRecommend().then(res => {
          if (res.code === REQ_OK) {
            this.sliders = res.data.slider;
          }
        });
      },
      loadImage() {
        if (!this.checkloaded) {
          this.checkloaded = true;
          this.$refs.scroll.refresh();
        }
      }
    },
    components: {
      Scroll,
      Carousel
    }
  };
</script>

<style lang="scss" scoped>

</style>
