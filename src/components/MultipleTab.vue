<template>
    <div class="ui-multiple_tab">
        <ul class="clearFix">
            <li class="ui-multiple_tab-item" v-for="item in tabLabel">
                <span @click="handleToggleRouter(item)" :class="item.index === navIndex && 'ui-link'">{{item.name}}</span>
                <i class="icon-guanbi1" @click="handleRemoveLabel(item.path)"></i>
            </li>
        </ul>
        <div class="ui-close_other" @click="handleCloseOtherLabel">
            <span class="ui-not_copy">关闭其他页</span>
        </div>
    </div>
</template>

<script>
    import {
        mapGetters
    } from 'vuex';
    import routerConfig from '@/router/routerConfig';
    export default {
        name: "MultipleTab",
        computed: {
            ...mapGetters(['tabLabel', 'navIndex'])
        },
        created() {
            this.$store.commit('SAVE_MULTIPLE_OBJ', this);
        },
        methods: {

            // 切换路由
            handleToggleRouter(route) {
                this.$store.commit('SAVE_NAV_INDEX', route.index);
                this.$router.push(route.path);
            },

            // 移除页签
            handleRemoveLabel(path) {
                if (this.tabLabel.length === 1) return;
                for (let i = 0; i < this.tabLabel.length; i++) {
                    if (this.tabLabel[i].path === path) {
                        if (this.tabLabel[i].index === this.navIndex) {
                            if (i > 0) {
                                this.$router.push(this.tabLabel[i - 1].path);
                                this.$store.commit('SAVE_NAV_INDEX', this.tabLabel[i - 1].index)
                            } else {
                                this.$router.push(this.tabLabel[i + 1].path);
                                this.$store.commit('SAVE_NAV_INDEX', this.tabLabel[i + 1].index)
                            }
                        }
                        this.$store.commit('SAVE_TAB_LABELS', {
                            path: path,
                            isRemove: 1,
                            isRemoveInx: i
                        });
                        break;
                    }
                }
            },

            // 移除其他标签
            handleCloseOtherLabel() {
                this.$store.commit('SAVE_TAB_LABELS', {
                    path: routerConfig.navJumpFn(this.navIndex).path,
                    name: routerConfig.navJumpFn(this.navIndex).name,
                    isRemove: 2
                });
            },
        }
    }
</script>

<style scoped lang="less">

    @import (reference) '../assets/less/index';
    @module-bdr_color: #d6d6d6;

    .ui-multiple_tab {
        height: 40px;
        border: 1px solid @base-bdr-color;
        border-bottom: 0 none;
        background: #ffffff;
        box-sizing: border-box;
        position: relative;
        overflow: hidden;

        ul {
            background: #F9F9F9;
            border-bottom: 1px solid @module-bdr_color;
            height: 38px;
        }

        .ui-multiple_tab-item {
            float: left;
            margin-left: 10px;
            height: 40px;
            box-sizing: border-box;
            position: relative;
            /*border-bottom: 1px solid #ffffff;*/

            span {
                display: inline-block;
                padding: 0 15px;
                line-height: 37px;
                font-size: @base-txt-one;
                color: #656565;
                cursor: pointer;
                /*margin-top: 6px;*/
                border-radius: 4px 4px 0 0;
                border: 1px solid transparent;
                border-bottom-color: @module-bdr_color;
                transition: all .2s linear;
            }

            i {
                position: absolute;
                margin-left: 10px;
                margin-right: 0;
                cursor: pointer;
                right: 2px;
                top: 14px;
                display: none;
                font-size: 10px;
                transition: all .2s linear;
            }

            &:hover i {
                display: block;
            }

            span.ui-link {
                padding-right: 20px;
                background: #ffffff;
                border: 1px solid @module-bdr_color;
                border-bottom: 1px solid #ffffff
            }

            span.ui-link + i {
                display: block!important;
                right: 5px;
                background: none;
            }
        }
        .ui-close_other {
            height: 24px;
            padding: 0 8px;
            line-height: 22px;
            border-radius: 15px;
            position: absolute;
            top: 50%;
            margin-top: -15px;
            right: 25px;
            background-color: #ffffff;
            border: 1px solid #cccccc;
            cursor: pointer;
            box-sizing: border-box;
            span {
                color: #656565;
                font-size: 12px;
            }
        }
    }
</style>