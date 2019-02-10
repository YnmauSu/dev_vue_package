<template>
    <div class="ui-main-module-table" v-if="initTable">
        <slot></slot>
        <el-table
                ref="myTable"
                border
                stripe
                :data="tableData"
                :height="tableHeight"
                @selection-change="handleSelectionChange">
            <el-table-column
                    v-if="isCheck"
                    type="selection"
                    width="50"
                    :selectable="selectable">
            </el-table-column>
            <el-table-column
                    v-for="(item, index) in tableKey"
                    :type="tableProps[index] === 'index' ? 'index' : ''"
                    :key="index"
                    :label="item"
                    :prop="tableProps[index]"
                    :width="tableWidth[index] || ''">
                <template slot-scope="scope">
                    <slot :name="tableProps[index]" :row="scope.row">{{tableProps[index] === 'index' ? autoAddTableInx(scope.$index) : scope.row[tableProps[index]]}}</slot>
                </template>
            </el-table-column>
            <template slot="empty">
                <div>
                    <NotData v-show="!tableData.length"></NotData>
                </div>
            </template>
        </el-table>
    </div>
</template>

<script>
    /**
     * name: 表格渲染信息
     *
     * params:
     *      tableKey: 表头信息  ['姓名', '性别']
     *      tableData:  表格数据  [{name: '小白'， sex: '男'}]
     *      tableProps:  表格props  ['name', 'sex']
     *      showSearch:  收缩搜索栏时切换表格高度
     *      isCheck:  是否可勾选
     * */
    import { autoAddTableInx } from '../services'
    import config from '@/assets/js/config'
    export default {
        name: "ComTableInfo",
        props: {
            tableKey: {
                type: Array,
                default() {
                    return []
                }
            },
            tableData: {
                type: Array,
                default() {
                    return []
                }
            },
            tableProps: {
                type: Array,
                default() {
                    return []
                }
            },
            showSearch: {
                type: Boolean,
                default: true
            },
            tableWidth: {
                type: Array,
                default() {
                    return ['80']
                }
            },
            isCheck: {
                type: Boolean,
                default: false
            },
            otherHeight: {
                type: Array,
                default() {
                    return []
                }
            },
            selectable: {
                type: Function,
                default() {
                    return () => {};
                }
            }
        },
        data() {
            return {
                initTable: true,
                tableHeight: '100px'
            }
        },
        methods: {
            autoAddTableInx,

            // 勾选
            handleSelectionChange(val) {
                this.$emit('checked', val)
            }
        },
        created() {},
        mounted() {
            this.$nextTick(() => {
                this.tableHeight = config.setTableHeight('ui-main-module', this.otherHeight);
                this.$refs['myTable'].doLayout();
            })
        },
        watch: {
            showSearch(val, old) {
                let vm = this;
                document.querySelector('body').style.overflow = 'hidden';
                setTimeout(() => {
                    vm.tableHeight = config.setTableHeight('ui-main-module', this.otherHeight);
                    vm.$refs['myTable'].doLayout();
                    document.querySelector('body').style.overflow = '';
                }, 400)
            }
        }
    }
</script>

<style scoped>

</style>