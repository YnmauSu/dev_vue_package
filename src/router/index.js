import Vue from 'vue'
import Router from 'vue-router'
import Store from '@/store'
import Layout from '../views/HomePage/Layout'
import NotAuthority from '../views/NotAuthority'
import * as storage from '@/utils/storage'
import CONFIG from '../assets/js/config'
import { getUserInfo } from '@/api/login'
import { getAddressModelParams } from '../services/index'
import configFn from './routerConfig'

import HomePage from '../views/HomePage/HomePage';

Vue.use(Router);

const router =  new Router({
    routes: [
        {
            path: '/home',
            name: 'home',
            component: Layout,
            redirect: '/hello',
            children: [
                {
                    path: '/hello',
                    name: 'hello',
                    component: HomePage,
                },
                {
                    path: '/notAuthority',
                    name: '无权限界面',
                    component: NotAuthority
                }
            ]
        },
        {
            path: '*',
            redirect: '/home'
        }
    ]
});

let isFirstRequset = false;

router.beforeEach((to, from, next) => {
    const path = to.path.replace(/\/$/, '');
    const isLogin = storage.getSessionStorage('userInfo');

    // 获取当前地址参数
    const queryParams = getAddressModelParams();

    // 判断是否第一次进入
    if (!isLogin && !isFirstRequset) {

        // 如果没有登录信息的话在这里调下初始化接口，查询登录信息后保存
        return new Promise(resolve => {
            // getUserInfo({
            //     access_token: queryParams['access_token']
            // }).then(({ data }) => {
            //     if (process.env.NODE_ENV == 'production') {
            //         CONFIG.HOME_PATH = data.data.path;
            //     }
            //     Store.commit('SAVE_LOGIN_INFO', data.data);
            //     Store.commit('SAVE_PERMIT_PATH_INFO', data.data.permissions);
            //     Store.commit('SAVE_PERMIT_RESOURCE_INFO', data.data.permissions);
            //     resolve(1)
            // });
            resolve(1)
        }).then(( data ) => {
            isFirstRequset = true;
            if (data) {

                // 判断是否无资源
                // if (!Store.getters.permitPath.length) {
                //     return next({
                //         path: '/notAuthority'
                //     })
                // }

                // // 获取默认菜单索引
                // let firstInx = Store.getters.permitPath.indexOf('/supplier_add') > -1 ? configFn.getRouteIndex('/supplier_add') : '1-1';
                //
                // // 获取默认菜单信息
                // let firstNav = configFn.navJumpFn(firstInx);
                //
                // // 跳转
                // next({
                //     path: firstNav.path
                // });
                //
                // // 保存到多页签
                // Store.commit('SAVE_TAB_LABELS', {
                //     path: firstNav.path,
                //     name: firstNav.name,
                //     index: firstInx
                // });
                //
                // // 激活菜单
                // Store.commit('SAVE_NAV_INDEX', firstInx)
                next();
            }
        });
    } else if (isLogin || isFirstRequset) {

        // 权限拦截
        // let isAuthority = Store.getters.permitPath;
        // if (isAuthority.indexOf(path) === -1 && path !== '/notAuthority') {
        //     return next({
        //         path: '/notAuthority'
        //     })
        // }

        next();
    } else {
        next();
    }
});

router.afterEach((to, from) => {
    Store.commit('SAVE_BUTTON_CONFIG', to.path.replace(/\/$/, ''));
});

export default router;
