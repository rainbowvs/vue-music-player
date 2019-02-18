import Vue from 'vue';
import fastclick from 'fastclick';
import VueLazyload from 'vue-lazyload';
import App from './App';
import router from './router';
import store from './store';
import './assets/style/index.scss';

const isDev = process.env.NODE_ENV === 'development';
if (isDev) {
  var VConsole = require('./assets/js/vconsole.min.js');
  /* eslint-disable no-unused-vars */
  var vConsole = new VConsole();
}

fastclick.attach(document.body);

Vue.use(VueLazyload, {
  loading: require('./assets/img/logo@2x.png')
});

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
});
