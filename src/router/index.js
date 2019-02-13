import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

const Recommend = resolve => {
  import('../pages/Recommend/Recommend.vue').then(module => {
    return resolve(module);
  });
};

const DiscDetail = resolve => {
  import('../pages/Recommend/DiscDetail').then(module => {
    return resolve(module);
  });
};

const Singer = resolve => {
  import('../pages/Singer/Singer').then(module => {
    resolve(module);
  });
};

const SingerDetail = (resolve) => {
  import('../pages/Singer/SingerDetail').then(module => {
    resolve(module);
  });
};

const Rank = resolve => {
  import('../pages/Rank/Rank').then(module => {
    resolve(module);
  });
};

const RankDetail = (resolve) => {
  import('../pages/Rank/RankDetail').then(module => {
    resolve(module);
  });
};

const Search = resolve => {
  import('../pages/Search/Search').then(module => {
    resolve(module);
  });
};

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/recommend'
    },
    {
      path: '/recommend',
      name: 'Recommend',
      component: Recommend,
      children: [
        {
          path: ':id',
          name: 'DiscDetail',
          component: DiscDetail
        }
      ]
    },
    {
      path: '/singer',
      name: 'Singer',
      component: Singer,
      children: [
        {
          path: ':id',
          name: 'singerSingerDetail',
          component: SingerDetail
        }
      ]
    },
    {
      path: '/rank',
      name: 'Rank',
      component: Rank,
      children: [
        {
          path: ':id',
          name: 'RankDetail',
          component: RankDetail
        }
      ]
    },
    {
      path: '/search',
      name: 'Search',
      component: Search,
      children: [
        {
          path: ':id',
          name: 'searchSingerDetail',
          component: SingerDetail
        }
      ]
    }
  ]
});
