import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

const Recommend = resolve => {
  import('../pages/Recommend/Recommend.vue').then(module => {
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

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/recommend'
    },
    {
      path: '/recommend',
      name: 'Recommend',
      component: Recommend
    },
    {
      path: '/singer',
      name: 'Singer',
      component: Singer,
      children: [
        {
          path: ':id',
          name: 'SingerDetail',
          component: SingerDetail
        }
      ]
    }
  ]
});
