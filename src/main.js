// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import App from './App';
import router from './router';
import ElementUI from 'element-ui';
import component from './components';
import store from './store';
import * as Storage from './utils/storage';
import mock from './mock';
import 'element-ui/lib/theme-chalk/index.css';
import '@/assets/css/index.css';
import '@/assets/css/common.css';
import '@/assets/css/135editor.css';
import '@/assets/fonts/iconfont.css';
import '@/assets/less/index.less';
import '@/assets/less/common.less';
import promise from 'es6-promise'

import directive from './directive';

// axios 请求兼容
promise.polyfill();

Vue.config.productionTip = false;
Vue.use(ElementUI);

/* 注册全局组件 */
Object.keys(component).forEach(key => {
    let name = key.replace(/(\w)/, (v) => v.toUpperCase()); // 首字母大写
    Vue.component(`${name}`, component[key]);
});

/* 注册全局指令 */
Object.keys(directive).forEach(key => {
    Vue.directive(`${key}`, directive[key]);
});

window.getEleAttr = function (_e, parent) {
    return parent ? parent.querySelector(_e) : document.querySelector(_e);
};

// 清除浏览器缓存，开发时可以注释
// window.addEventListener("unload", function(event) {
//     Storage.clearSessionStorage();
// });

/* eslint-disable no-new */
new Vue({
    el: '#app',
    router,
    store,
    components: {App},
    template: '<App/>'
});
