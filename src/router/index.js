import Vue from 'vue';
import Router from 'vue-router';
import Recommend from '../pages/Recommend/Recommend.vue';

Vue.use(Router);

const DiscDetail = resolve => {
  import(
    /* webpackChunkName: "DiscDetail" */
    '../pages/Recommend/DiscDetail'
  ).then(module => {
    return resolve(module);
  });
};

const Singer = resolve => {
  import(
    /* webpackChunkName: "Singer" */
    '../pages/Singer/Singer'
  ).then(module => {
    resolve(module);
  });
};

const SingerDetail = (resolve) => {
  import(
    /* webpackChunkName: "SingerDetail" */
    '../pages/Singer/SingerDetail'
  ).then(module => {
    resolve(module);
  });
};

const Rank = resolve => {
  import(
    /* webpackChunkName: "Rank" */
    '../pages/Rank/Rank'
  ).then(module => {
    resolve(module);
  });
};

const RankDetail = (resolve) => {
  import(
    /* webpackChunkName: "RankDetail" */
    '../pages/Rank/RankDetail'
  ).then(module => {
    resolve(module);
  });
};

const Search = resolve => {
  import(
    /* webpackChunkName: "Search" */
    '../pages/Search/Search'
  ).then(module => {
    resolve(module);
  });
};

const User = resolve => {
  import(
    /* webpackChunkName: "User" */
    '../pages/User/User'
  ).then(module => {
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
    },
    {
      path: '/user',
      name: 'User',
      component: User
    }
  ]
});
