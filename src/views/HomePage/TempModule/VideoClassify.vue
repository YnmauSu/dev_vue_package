<template>
    <div class="ui-main-module">
        <transition name="slide-fade">
            <div class="ui-search-area" v-if="showSearch">
                <ul class="ui-main-module-search clearFix">
                    <li>
                        <SearchRequirement label="分类名称">
                            <el-input size="small" v-model.trim="queryData.classifyName"></el-input>
                        </SearchRequirement>
                    </li>
                    <li>
                        <SearchRequirement label="播放模式" v-model.trim="queryData.playMode" template="select" :options="optionList.playModeList">
                        </SearchRequirement>
                    </li>
                </ul>
                <FilterBtn refTable="myTable" :resetFn="handleResetQueryInfo" :queryFn="handleQueryInfo" :params="{limit: pageData.currentList}"></FilterBtn>
            </div>
        </transition>
        <div class="ui-fn-module">
            <span class="ui-top_i" @click="showSearch = !showSearch"><ComIcon
                    :name="showSearch ? 'shrink_up' : 'shrink_down'"></ComIcon></span>
            <el-button type="text" size="small" @click="handleEdit()">添加分类</el-button>
            <el-button type="text" size="small" @click="handleDelete()">批量删除</el-button>
        </div>
        <ComTableInfo
                isCheck
                :tableKey="tableKey"
                :tableProps="tableProps"
                :tableData="tableData"
                :tableWidth="tableWidth"
                :showSearch="showSearch"
                @checked="handleSaveCheckInfo">
            <template slot="operation" slot-scope="scope">
                <el-button type="text" size="small" @click="handleEdit(scope.row)">编辑</el-button>
                <el-button type="text" size="small" @click="handleDelete(scope.row)">删除</el-button>
            </template>
        </ComTableInfo>
        <div class="ui-main-module-page">
            <ComPagination
                    :checkNum="saveCheckInfo"
                    :currentPage="pageData.currentPage"
                    :pageSizes="pageSizes"
                    :pageSize="pageData.currentList"
                    :total="pageData.currentTotal"
                    @sizeChange="handleSizeChange"
                    @currentChange="handleCurrentChange">
            </ComPagination>
        </div>
        <com-dialog
                :title="dialog.edit ? '编辑' : '新增'"
                width="400px"
                top="3vh"
                :close-on-click-modal="false"
                :show.sync="dialog.add" @close="handleCancelEdit">
            <el-form ref="editModel" label-width="100px" :model="editData" :rules="editRule" size="small">
                <el-form-item prop="classifyName" label="分类名称">
                    <el-input v-model.trim="editData.classifyName"></el-input>
                </el-form-item>
                <el-form-item prop="playMode" label="播放模式">
                    <el-select v-model="editData.playMode">
                        <el-option v-for="item in optionList.playModeList" :label="item.value" :value="item.key" :key="item.key"></el-option>

                    </el-select>
                </el-form-item>
            </el-form>
            <div slot="footer" class="ui-com_edit--btn">
                <el-button size="small" @click="handleCancelEdit">取消</el-button>
                <el-button size="small" type="primary" @click="handleConfirmEdit">确认</el-button>
            </div>
        </com-dialog>
    </div>
</template>

<script>
    import CONFIG from '@/assets/js/config';
    import {
        getVideoClassifyList,
        addVideoClassify,
        modifyVideoClassify,
        deleteVideoClassify,
    } from '@/api/temp_module/video_classify'
    import {
        autoAddTableInx,
    } from '@/services/index';
    import {
        mapGetters
    } from 'vuex';

    // 组件名称，用于keep-alive和权限
    const component_name = 'video_classify';
    export default {
        name: component_name,
        data () {


            return {

                // 时间搜索框宽度设置
                searchDateWidth: CONFIG.SEARCH_DATE_WIDTH,

                thisVm: {},

                // 搜索缩进
                showSearch: true,

                queryData: {
                    classifyName: '',
                    playMode: '',
                },

                optionList: {
                    playModeList: []
                },

                tableData: [],
                tableKey: [],
                tableWidth: [],
                tableProps: [],

                // 保存勾选数据
                saveCheckInfo: [],

                //分页
                pageSizes: CONFIG.pageData.pageSizes,
                pageData: {
                    currentPage: 1,
                    currentList: 20,
                    currentTotal: 0,
                },

                dialog: {
                    add: false,
                    edit: false
                },

                saveCheckRow: {},

                editData: {
                    classifyName: '',
                    playMode: '',
                },

                editRule: {
                    classifyName: CONFIG.RULE_CONFIG.requiredBlur,
                    playMode: CONFIG.RULE_CONFIG.requiredChange,
                }
            };
        },
        computed: {
            ...mapGetters([
                'queryParamsInfo',
                'supplierQualifiedInfo',
                'comOptions'
            ]),
            buttonList() {
                return CONFIG.AUTHORITY_BUTTON[component_name].buttonList;
            }
        },
        methods: {
            autoAddTableInx,

            // 列表信息查询
            handleQueryInfo (params = {}, isFn) {

                // 判断是否为功能参数
                if (isFn) {
                    // 获取保存的查询参数
                    this.queryData = JSON.parse(this.queryParamsInfo['video_classify']);
                }

                let obj = {
                    classify_name: this.queryData.classifyName,
                    pattern: this.queryData.playMode,
                    ...params
                };

                getVideoClassifyList(obj).then(({data}) => {

                    // 导出
                    if (data.status === 2) return;

                    this.handleQueryInfoCallBack(data);
                }).catch(err => {
                    console.log(err);
                });
            },

            // 查询重置
            handleResetQueryInfo () {
                this.queryData = {
                    classifyName: '',
                    playMode: '',
                };
            },

            // 分页条数切换
            handleSizeChange (val) {
                this.handleQueryInfo({
                    limit: val,
                    offset: 1
                }, true);
            },

            // 跳转页数切换
            handleCurrentChange (val) {
                this.handleQueryInfo({
                    limit: this.pageData.currentList,
                    offset: val
                }, true);
            },

            // 保存勾选数据
            handleSaveCheckInfo (val) {
                this.saveCheckInfo = val;
            },

            // 删除
            handleDelete(row) {
                let obj = {};
                if (!row) {
                    if (!this.saveCheckInfo.length) {
                        this.$message.warning('请勾选数据！');
                        return;
                    }
                    obj.ids = JSON.stringify(this.saveCheckInfo.map(item => item.id));
                } else {
                    obj.ids = row.id;
                }
                this.$confirm(`确认删除该数据吗？`, '提示', {
                    type: "warning"
                }).then(() => {
                    deleteVideoClassify(obj).then(({ data }) => {
                        this.handleOperationCallBack(data);
                    })
                });
            },

            // 编辑
            handleEdit(row) {
                this.dialog.add = true;
                this.dialog.edit = true;
                if (row) {
                    this.editData.classifyName = row.classify_name;
                    this.editData.playMode = row.pattern;
                    this.saveCheckRow = row;
                }
            },

            // 取消编辑
            handleCancelEdit() {
                this.editData = {
                    classifyName: '',
                    playMode: '',
                }
                this.dialog.add = false;
                this.dialog.edit = false;
                this.$nextTick().then(() => {
                    this.$refs.editModel.resetFields();
                })
            },

            // 确认编辑
            handleConfirmEdit() {
                this.$refs.editModel.validate(res => {
                    if (res) {
                        let obj = {
                            classify_name: this.editData.classifyName,
                            pattern: this.editData.playMode,
                        };

                        if (this.dialog.edit) {
                            obj.classify_id = this.saveCheckRow.id;
                            modifyVideoClassify(obj).then(({ data }) => {
                                this.handleOperationCallBack(data, this.handleCancelEdit)
                            })
                        } else {
                            addVideoClassify(obj).then(({ data }) => {
                                this.handleOperationCallBack(data, this.handleCancelEdit);
                            })
                        }
                    }
                })
            },

            // 操作回调
            handleOperationCallBack (data, success) {
                if (data.status) {
                    success && success();
                    this.$message.success('操作成功');
                    this.handleQueryInfo({limit: this.pageData.currentList});
                } else {
                    this.$message.error(data.errorMess || '操作失败');
                }
            },

            //查询回调
            handleQueryInfoCallBack (data) {

                // 保存查询参数
                this.$store.commit('SAVE_QUERY_PARAMS_INFO', {
                    key: 'video_classify',
                    value: JSON.stringify(this.queryData)
                });


                //数据渲染
                this.tableData = data.data_list.values;
                this.tableKey = data.data_list.key;
                this.tableProps = ['index', 'classify_name', 'pattern_cn', 'operation'];
                this.tableWidth[2] = '100';
                this.tableWidth[3] = '100';


                this.optionList.playModeList = data.drop_down_box.pattern_list

                // //渲染分页
                this.pageData.currentList = data.paging_data.limit * 1;
                this.pageData.currentPage = data.paging_data.offset * 1;
                this.pageData.currentTotal = data.paging_data.total * 1;
            }
        },
        created () {
            try {
                this.handleQueryInfo({is_get_base: 1});
            } catch (e) {
                console.log(e);
            }
        },
        activated() {
            // console.log('activated')
        }
    };
</script>

<style lang="less" scoped>
    .ui-main-tab {
        margin: 0 0 15px 0;
        border-bottom: 1px solid #e6e6e6;
    }
</style>
