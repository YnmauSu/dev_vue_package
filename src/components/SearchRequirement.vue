<template>
    <div class="ui-search_require clearFix" :style="{ width: areaWidth }">
        <label class="ui-search_label" :style="{ width: width }">{{ label }}</label>
        <div class="ui-search_input" :style="{ marginLeft: width }" :class="isTwo && 'ui-search_input-two'">
            <slot>
                <el-input v-if="template === 'input'" :size="size" v-model.trim="modelForm"></el-input>
                <el-date-picker
                        clearable
                        :disabled="isDisabled"
                        :default-time="[]"
                        v-else-if="template === 'daterange'"
                        v-model="modelForm"
                        type="daterange"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        format="yyyy-MM-dd"
                        value-format="yyyy-MM-dd"
                        :size="size">
                </el-date-picker>
                <el-cascader
                        :disabled="isDisabled"
                        clearable
                        v-else-if="template === 'cascader'"
                        filterable
                        change-on-select
                        v-model="modelForm"
                        :size="size"
                        placeholder="请选择"
                        :props="props"
                        :options="cascaderOption"
                        @change="change"
                ></el-cascader>
                <el-select clearable v-model="modelForm" :size="size" v-if="template === 'select' && Array.isArray(options)">
                    <el-option v-for="item in options" :label="item.value" :value="item.key" :key="item.key"></el-option>
                </el-select>
                <el-select clearable v-model="modelForm" :size="size" v-else-if="template === 'select'">
                    <el-option v-for="(label, value) in options" :label="label" :value="value" :key="value"></el-option>
                </el-select>
                <el-select :disabled="isDisabled" clearable v-else-if="template === 'search'" :size="size" v-model="modelForm" filterable
                           placeholder="请选择"
                           @change="searchChange">
                    <el-option
                            v-for="item in options"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                    </el-option>
                </el-select>
                <BigSelect v-else-if="template === 'bigSelect'" :options="options" v-model="modelForm" :is-disabled="isDisabled"></BigSelect>
            </slot>
        </div>
    </div>
</template>

<script>
    /**
     *  头部查询组件 > 简便头部书写，自适应宽度
     * */
    export default {
        name: 'SearchRequirement',
        model: {
            prop: 'model',
            event: 'changes'
        },
        props: {
            template: {
                type: String,
                default: ''
            },
            model: '',
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
            },
            props: {
                type: Object,
                default () {
                    return {value: 'city_code', label: 'city_name'};
                }
            },
            options: {
                type: [Array, Object],
                default () {
                    return [];
                }
            },
            isDisabled: {
                type: Boolean,
                default: false
            },
            size:{
                type:String,
                default:'small'
            }
        },
        data () {
            return {
                areaWidth: '',
                minWidth: 325,
                modelForm: '',
                cascaderOption: []
            };
        },
        created () {
            this.modelForm = this.model;
            if (this.template === 'cascader') {
                let interval = setInterval(() => {
                    if (this.options && this.options.length > 0) {
                        this.cascaderOption = [...this.options];
                        this.handleTreeCallBackChange(this.cascaderOption);
                        clearInterval(interval);
                    }
                }, 500);
            }
        },
        mounted () {
            this.$nextTick(() => {
                if (getEleAttr('.ui-search-area')) {
                    let areaWidth = (getEleAttr('.ui-search-area').offsetWidth - 140) / 5;
                    this.areaWidth = (this.fixedWidth || areaWidth) + 'px';
                }
            });

        },
        methods: {

            // 重构树形结构
            handleTreeCallBackChange (arr) {
                for (let i = 0; i < arr.length; i++) {
                    if (arr[i].son_id && arr[i].son_id.length) {
                        this.handleTreeCallBackChange(arr[i].son_id);
                    } else {
                        delete arr[i].son_id;
                    }
                }
            },
            change (val) {
                this.$emit('change', val);
            },
            searchChange () {
                this.$emit('searchChange');
            },

            // 重置
            handleChange(val) {
                // console.log(val);
            }
        },
        watch: {
            modelForm (val) {
                if (this.template === 'daterange') {
                    this.$emit('changes', val || []);
                } else {
                    this.$emit('changes', val);
                }
            },
            model () {
                this.modelForm = this.model;
            },
        }
    };
</script>

<style scoped lang="less">
    .ui-search_require {
        .ui-search_label {
            display: block;
            float: left;
            line-height: 32px;
            padding-right: 12px;
            box-sizing: border-box;
            text-align: right;
            font-size: 12px;
            color: #333333;
        }

        .ui-search_input {
            line-height: 32px;

            .el-select {
                width: 100%;
            }

            /deep/ .el-input--suffix .el-input__inner {
                height: 32px !important;
                line-height: 32px;
            }

        }

        .ui-search_input-two {
            .el-input {
                width: 42% !important;
            }
        }

        .el-cascader {
            width: 100%;
        }
    }
</style>
