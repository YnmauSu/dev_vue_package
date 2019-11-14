import Vue from 'vue'
import Router from 'vue-router'
import Store from '@/store'
import Layout from '../views/HomePage/Layout'
import NotAuthority from '../views/NotAuthority'
import * as storage from '@/utils/storage'
import CONFIG from '../assets/js/config'
import { getUserInfo } from '@/api/login'
import configFn from './routerConfig'

import LoginLayout from '../views/login/Layout'
import LoginHomePage from '../views/login/module_page/LoginHomePage'

// 用户管理
import UserManage from '../views/HomePage/UserManage/UserManage';

// 角色管理
import RoleManage from '../views/HomePage/ManageSettle/RoleManage'

// 资源管理
import ResourceManage from '../views/HomePage/ManageSettle/ResourceManage'

// 客户端管理
import ClientManage from '../views/HomePage/UserManage/ClientManage'

// 视频分类
import VideoClassify from '../views/HomePage/TempModule/VideoClassify'

// 视频列表
import VideoModule from '../views/HomePage/TempModule/VideoModule'

// 推广
import SpreadPage from '../views/HomePage/TempModule/SpreadPage'

Vue.use(Router);

const router =  new Router({
    routes: [
        {
            path: '/login',
            name: '登录首页',
            component: LoginLayout,
            redirect: '/home_page',
            children: [
                {
                    name: '首页',
                    path: '/home_page',
                    component: LoginHomePage
                }
            ]
        },
        {
            path: '/home',
            name: 'home',
            component: Layout,
            redirect: '/user_manage',
            children: [
                {
                    name: '用户管理',
                    path: '/user_manage',
                    component: UserManage
                },
                {
                    name: '角色管理',
                    path: '/role_manage',
                    component: RoleManage
                },
                {
                    name: '资源管理',
                    path: '/resource_manage',
                    component: ResourceManage
                },
                {
                    name: '客户端管理',
                    path: '/client_manage',
                    component: ClientManage
                },
                {
                    name: '视频分类',
                    path: '/video_classify',
                    component: VideoClassify
                },
                {
                    name: '视频列表',
                    path: '/video_list',
                    component: VideoModule
                },
                {
                    name: '视频推广',
                    path: '/spread_page',
                    component: SpreadPage
                }
            ]
        },
        {
            path: '*',
            redirect: '/login'
        }
    ]
});

let isFirst = true;

router.beforeEach((to, from, next) => {
    const path = to.path.replace(/\/$/, '');
    const isLogin = storage.getSessionStorage('user_info');
    if (!isLogin && to.path !== '/home_page') {
        return next({
            path: '/home_page'
        })
    } else if (isFirst) {

        isFirst = false;

        // 获取默认菜单索引
        let firstPath = '/user_manage';
        let firstInx = Store.getters.permitPath.indexOf(firstPath) > -1 ? configFn.getRouteIndex(firstPath) : configFn.getRouteIndex(firstPath);
        //
        // 获取默认菜单信息
        let firstNav = configFn.navJumpFn(firstInx);

        // 跳转
        next({
            path: firstNav.path
        });

        // 保存到多页签
        Store.commit('SAVE_TAB_LABELS', {
            path: firstNav.path,
            name: firstNav.name,
            index: firstInx
        });

        // 激活菜单
        Store.commit('SAVE_NAV_INDEX', firstInx);
    } else {
        next();
    }
});

router.afterEach((to, from) => {
    Store.commit('SAVE_BUTTON_CONFIG', to.path.replace(/\/$/, ''));
});

export default router;
