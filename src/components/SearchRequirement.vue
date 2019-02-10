<template>
    <div class="ui-search_require clearFix" :style="{ width: areaWidth }">
        <label class="ui-search_label" :style="{ width: width }">{{ label }}</label>
        <div class="ui-search_input" :style="{ marginLeft: width }" :class="isTwo && 'ui-search_input-two'">
            <slot></slot>
        </div>
    </div>
</template>

<script>
    /**
     *  头部查询组件 > 简便头部书写，自适应宽度
     * */
    export default {
        name: "SearchRequirement",
        props: {
            label: {
                type: String,
                default: ''
            },
            width: {
                type: String,
                default: '100px'
            },
            fixedWidth: {
                type: String,
                default: ''
            },
            isTwo: {
                type: Boolean,
                default: false
            }
        },
        data() {
            return {
                areaWidth: '',
                minWidth: 325
            }
        },
        mounted() {
            let areaWidth = (getEleAttr('.ui-search-area').offsetWidth - 390) / 4;
            // this.areaWidth = areaWidth > this.minWidth ? areaWidth + 'px' : this.minWidth + 'px';
            this.areaWidth = (this.fixedWidth || areaWidth) + 'px';
        }
    }
</script>

<style scoped lang="less">
    .ui-search_require {
        .ui-search_label {
            display: block;
            float: left;
            font-size: 14px;
            line-height: 45px;
            padding-right: 15px;
            box-sizing: border-box;
            text-align: right;
        }
        .ui-search_input {
            line-height: 45px;
        }

        .ui-search_input-two {
            .el-input {
                width: 42% !important;
            }
        }
    }
</style>