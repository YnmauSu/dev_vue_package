<template>
    <div class="ui-nav-bar">
        <div class="user-info" v-show="!isCollapse">
            <img :src="loginInfo.head_image_url?loginInfo.head_image_url:defaultImg" alt="">
            <p>{{loginInfo.user_name}}</p>
        </div>
        <div class="ui-system-info">
            <span @click="isCollapse = !isCollapse" :style="{ marginRight: isCollapse ? '17px' : '' }">
                <i :class="isCollapse ? 'icon-zhankai' : 'icon-shouqi'" style="color: #666666"></i>
            </span>
        </div>
        <el-menu
                ref="navMenu"
                unique-opened
                :default-active="activeIndex"
                class="ui-menu"
                mode="vertical"
                @select="handleSelectModule"
                :collapse="isCollapse">
            <el-submenu
                    v-for="(item, index) in routerList"
                    :key="index"
                    :index="index + 1 + ''">
                <template slot="title">
                    <i :class="autoActiveParentNav(index + 1) ? 'active ' + item.icon : 'default ' + item.icon "></i>
                    <span :class="autoActiveParentNav(index + 1) ? 'active' : ''">{{item.name}}</span>
                </template>
                <el-menu-item-group
                        v-for="(itemChild, inx) in item.children"
                        :key="inx">
                    <el-menu-item
                            v-if="!itemChild.children || !itemChild.children.length"
                            :index="(index + 1) + '-' + (inx + 1)"><span class="menu-item-dot"><i class="normal-dot" :class="navIndex === (index + 1) + '-' + (inx + 1) ? 'active-dot' : ''"></i></span><span>{{itemChild.name}}</span></el-menu-item>
                    <el-submenu
                            v-if="itemChild.children && itemChild.children.length"
                            :index="(index + 1) + '-' + (inx + 1)">
                        <template slot="title">{{itemChild.name}}</template>
                        <el-menu-item
                                v-for="(itemChildren, i) in itemChild.children"
                                :key="i"
                                :index="(index + 1) + '-' + (inx + 1) + '-' + (i + 1)"><span>{{itemChildren.name}}</span></el-menu-item>
                    </el-submenu>
                </el-menu-item-group>
            </el-submenu>
        </el-menu>
    </div>
</template>

<script>
    import * as storage from '@/utils/storage'
    import { mapGetters } from 'vuex';
    import routerConfig from '@/router/routerConfig';
    import * as service from '@/services';
    import CONFIG from '@/assets/js/config';

    export default {
        name: "NavPage",
        data() {
            return {
                isShowUpdate: false,
                isCollapse: false,
                activeIndex: '1-1',
                isOpened: false,
                defaultImg: require('../../assets/image/logo-img.png')
            }
        },
        computed: {
            ...mapGetters(['navIndex','loginInfo']),
            routerList() {
                return routerConfig.getRouteConfig();
            }
        },
        methods: {
            handleSelectModule(inx) {
                this.activeIndex = inx;
                storage.setSessionStorage('navActive', inx);

                let to = routerConfig.navJumpFn(inx);
                this.$router.push(to.path);
                this.$store.commit('SAVE_TAB_LABELS', {
                    path: to.path,
                    name: to.name,
                    index: inx,
                });
                this.$store.commit('SAVE_NAV_INDEX', inx)
            },

            // 激活父级导航
            autoActiveParentNav(inx) {
                return new RegExp(`^${inx}`).exec(this.navIndex);
            }
        },
        created() {
            let _this=this;
            window.parent.postMessage({
                complete: true
            }, CONFIG.IN_PRODUCTION_PATH);

            this.activeIndex = this.navIndex;
            // 接收上传的头像
            window.addEventListener('message',function(e){
                if(e.data.result){
                    _this.loginInfo.head_image_url=e.data.result;
                    _this.$store.commit('SAVE_LOGIN_INFO',_this.loginInfo);
                }
            });
        },
        mounted() {
            window.addEventListener('message',function(e){
                if (e.data.theme) {
                    let el = document.querySelector('.ui-main');
                    el.className = el.className.replace(/ui-theme[_a-zA-Z]+$/, 'ui-' + e.data.theme);
                }
            });
            let el = document.querySelector('.ui-main');
            el.className = el.className.replace(/ui-theme[_a-zA-Z]+$/, 'ui-' + (this.loginInfo.theme || 'theme_default'));
        },
        watch: {
            isCollapse(val) {
                let view = document.querySelector('.ui-content');
                if (val) {
                    setTimeout(() => {
                        view.style.paddingLeft = '90px';
                    }, 300)
                } else {
                    this.$refs.navMenu.updateActiveIndex();
                    view.style.paddingLeft = '220px';
                }
            },
            navIndex(val) {
                this.activeIndex = val;
                this.$refs.navMenu.updateActiveIndex();
            }

        }
    }
</script>

<style scoped lang="less">
    @import (reference) '../../assets/less/index';
</style>
