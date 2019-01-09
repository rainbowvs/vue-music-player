import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

const Recommend = resolve => {
  import('../pages/Recommend/Recommend.vue').then(module => {
    return resolve(module);
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
    }
  ]
});
