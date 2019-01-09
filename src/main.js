import Vue from 'vue';
import fastclick from 'fastclick';
import VueLazyload from 'vue-lazyload';
import App from './App';
import router from './router';
import './assets/style/index.scss';

fastclick.attach(document.body);

Vue.use(VueLazyload, {
  loading: require('./assets/img/logo@2x.png')
});

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
});
