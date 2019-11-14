<template>
    <div class="ui-Filter-btn">
        <el-button @click="handleReset" size="small" icon="icon-zhongzhi">重置</el-button>
        <el-button size="small" type="primary" @click="handleQuery"
                   icon="icon-chaxun">查询
        </el-button>
        <el-button size="small"
                   type="text"
                   @click="handleClickFilter"
                   v-show="!FilterShow">高级筛选<i class="el-icon-caret-bottom"></i></el-button>
        <el-button size="small"
                   type="text"
                   @click="handleClickFilter"
                   v-show="FilterShow">基本筛选<i class="el-icon-caret-top"></i></el-button>
    </div>
</template>

<script>
    /**
     * @props => resetFn 重置方法
     * @props => queryFn 重置方法
     * @props => params  查询参数
     * @props => refTable  表格实例
     * */
    export default {
        name: "FilterBtn",
        props: {
            resetFn: {
                type: Function,
                default() {
                    console.log('not reset function!')
                }
            },
            queryFn: {
                type: Function,
                default() {
                    console.log('not query function!')
                }
            },
            params: {
                type: Object,
                default() {
                    return {}
                }
            },
            refTable: {
                type: String,
                default() {
                    return ''
                }
            }
        },
        data() {
            return {
                FilterShow: false
            }
        },
        methods: {
            //高级筛选
            handleClickFilter () {
                if (this.FilterShow) {
                    this.autoHideEle();
                    document.querySelector('body').style.overflow = 'hidden';
                } else {
                    this.autoHideEle('show');
                }
                this.FilterShow = !this.FilterShow;
                this.$parent.$refs[this.refTable] && this.$parent.$refs[this.refTable].doLayout();
            },

            handleQuery() {
                this.queryFn && this.queryFn(this.params);
            },

            handleReset() {
                this.resetFn && this.resetFn();
            },

            autoHideEle(type = 'hide') {
                document.querySelectorAll('.ui-main-module-search > li').forEach(_ele => {
                    if (type === 'show') {
                        _ele.style.display = 'block';
                    } else {
                        const { top } = _ele.getBoundingClientRect();
                        if (top > 100) {
                            _ele.style.display = 'none';
                        }
                    }
                });
            }
        },
        mounted() {
            this.$nextTick().then(() => {
                this.autoHideEle();
            })
        }
    }
</script>

<style scoped>
</style>