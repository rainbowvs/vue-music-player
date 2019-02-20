import Vue from 'vue';
import fastclick from 'fastclick';
import VueLazyload from 'vue-lazyload';
import App from './App';
import router from './router';
import store from './store';
import './assets/style/index.scss';

/* vconsole devtool */
var VConsole = require('./assets/js/vconsole.min.js');
new VConsole();

/* fastclick */
fastclick.attach(document.body);

/* vue-lazyload initial config */
const preImg = require('./assets/img/1px.gif');
Vue.use(VueLazyload, {
  loading: preImg,
  error: preImg
});

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
});
