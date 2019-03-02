<template>
  <div class="singer">
    <list-view :dataList="singers" @select="selectSinger"></list-view>
    <router-view />
  </div>
</template>

<script>
  import { mapMutations } from 'vuex';
  import ListView from 'coms/ListView/ListView';
  import Singer from 'assets/js/singer';
  import { requestSinger } from 'api/singer';
  import { REQ_STATE } from 'api/config';
  export default {
    data() {
      return {
        singers: []
      };
    },
    mounted() {
      this.getSinger();
    },
    methods: {
      selectSinger(singer) {
        this.setSinger(singer);
        this.$router.push({
          path: `/singer/${singer.id}`
        });
      },
      getSinger() {
        requestSinger().then(res => {
          if (res.code === REQ_STATE.OK) {
            this.singers = this.normalize(res.data.list);
          }
        });
      },
      normalize(originList) {
        const HOT_SINGER_LEN = 10;
        const HOT_NAME = '热门';
        const singerMap = {
          hot: {
            title: HOT_NAME,
            items: []
          }
        };
        // 格式化
        originList.forEach((v, i) => {
          const item = new Singer({
            id: v.Fsinger_mid,
            name: v.Fsinger_name
          });
          const key = v.Findex; // 首字母
          if (i < HOT_SINGER_LEN) {
            // 取前 HOT_SINGER_LEN 个放入热门类
            singerMap.hot.items.push(item);
          }
          if (!singerMap[key]) {
            // 如果不存在首字母为 key 的类别, 则创建该类
            singerMap[key] = {
              title: key,
              items: []
            };
          }
          singerMap[key].items.push(item); // 加入该类
        });
        // 分类
        const hot = [];
        const letter = [];
        for (let key in singerMap) {
          const val = singerMap[key];
          if (val.title.match(/[a-zA-Z]/)) {
            // 首字母类
            letter.push(val);
            continue;
          } else if (val.title === HOT_NAME) {
            // 热门类
            hot.push(val);
          }
        }
        // 排升序
        letter.sort((a, b) => a.title.charCodeAt(0) - b.title.charCodeAt(0));
        return hot.concat(letter);
      },
      ...mapMutations({
        setSinger: 'SET_SINGER'
      })
    },
    components: {
      ListView
    }
  };
</script>

<style lang="scss" scoped>
  .singer {
    position: fixed;
    width: 100%;
    top: 1.76rem;
    bottom: 0;
  }
</style>
