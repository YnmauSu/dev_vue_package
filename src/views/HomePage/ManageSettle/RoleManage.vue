<template>
    <div class="ui-main-module">
        <transition name="slide-fade">
            <div class="ui-search-area" v-if="showSearch">
                <ul class="ui-main-module-search clearFix">
                    <li>
                        <SearchRequirement label="角色名称">
                            <el-input size="small" v-model.trim="queryData.roleName"></el-input>
                        </SearchRequirement>
                    </li>
                </ul>
                <FilterBtn refTable="myTable" :resetFn="handleResetQueryInfo" :queryFn="handleQueryInfo" :params="{limit: pageData.currentList}"></FilterBtn>
            </div>
        </transition>
        <div class="ui-fn-module">
            <span class="ui-top_i" @click="showSearch = !showSearch"><ComIcon
                    :name="showSearch ? 'shrink_up' : 'shrink_down'"></ComIcon></span>
            <el-button type="text" size="small" @click="handleEditRole()">新增角色</el-button>
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
                <el-button type="text" size="small" @click="handleEditRole(scope.row)">编辑</el-button>
                <el-button type="text" size="small" @click="handleDeleteRole(scope.row)">删除</el-button>
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
                :title="dialog.add ? '新增' : '编辑'"
                width="400px"
                top="3vh"
                :close-on-click-modal="false"
                :show.sync="dialog.add" @close="handleCancelEdit">
            <el-form ref="editModel" label-width="60px" :model="editData" :rules="editRule" size="small">
                <el-form-item prop="roleName" label="角色名">
                    <el-input v-model.trim="editData.roleName"></el-input>
                </el-form-item>
                <el-form-item prop="resource" label="资源">
                    <el-tree
                            class="filter-tree"
                            node-key="resource_id"
                            show-checkbox
                            :data="optionList.resourceList"
                            :props="{label: 'menu_name'}"
                            default-expand-all
                            ref="roleTree">
                    </el-tree>
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
        getRoleInfoList,
        getRoleTreeData,
        addRoleData,
        modifyRoleData,
        deleteRoleData
    } from '@/api/manage_settle/role_manage'
    import {
        autoAddTableInx,
    } from '@/services/index';
    import {
        mapActions,
        mapGetters
    } from 'vuex';

    // 组件名称，用于keep-alive和权限
    const component_name = 'role_manage';
    export default {
        name: component_name,
        components: {
        },
        data () {

            let validateResource = (rule, value, callback) => {
                if (!this.$refs.roleTree.getCheckedKeys().length) {
                    callback(new Error('带*号不能为空'));
                } else {
                    callback();
                }
            };


            return {

                // 时间搜索框宽度设置
                searchDateWidth: CONFIG.SEARCH_DATE_WIDTH,

                thisVm: {},

                // 搜索缩进
                showSearch: true,

                queryData: {
                    roleName: ''
                },

                optionList: {
                    resourceList: []
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
                    add: false
                },

                saveCheckRow: {},

                editData: {
                    roleName: '',
                    resource: []
                },

                editRule: {
                    roleName: CONFIG.RULE_CONFIG.requiredBlur,
                    resource: {
                        validator: validateResource
                    }
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
                    this.queryData = JSON.parse(this.queryParamsInfo['role_manage']);
                }

                let obj = {
                    role_name: this.queryData.roleName,
                    ...params
                };

                getRoleInfoList(obj).then(({data}) => {

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
                    roleName: ''
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

            // 删除角色
            handleDeleteRole(row) {
                this.$confirm(`确认删除该角色吗？`, '提示', {
                    type: "warning"
                }).then(() => {
                    let obj = {
                        role_id: row.role_id,
                    }
                    deleteRoleData(obj).then(({ data }) => {
                        this.handleOperationCallBack(data);
                    })
                });
            },

            // 点击新增用户
            handleEditRole(row) {
                this.dialog.add = true;
                if (row) {

                    getRoleTreeData({
                        role_id: row.role_id
                    }).then(({ data }) => {
                        this.$refs.roleTree.setCheckedKeys(data.data_list.resource_data || []);
                        this.editData.roleName = row.name;
                        this.saveCheckRow = row;
                        this.dialog.edit = true;
                    })
                }
            },

            // 取消编辑
            handleCancelEdit() {
                this.editData = {
                    roleName: '',
                }
                this.dialog.add = false;
                this.dialog.edit = false;
                this.$refs.roleTree.setCheckedKeys([]);
                this.$nextTick().then(() => {
                    this.$refs.editModel.resetFields();
                })
            },

            // 确认编辑
            handleConfirmEdit() {
                this.$refs.editModel.validate(res => {
                    if (res) {
                        let obj = {
                            role_name: this.editData.roleName,
                            resources: JSON.stringify(this.$refs.roleTree.getCheckedKeys())
                        };

                        if (this.dialog.edit) {
                            obj.role_id = this.saveCheckRow.role_id;
                            modifyRoleData(obj).then(({ data }) => {
                                this.handleOperationCallBack(data, this.handleCancelEdit);
                            })
                        } else {
                            addRoleData(obj).then(({ data }) => {
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
                    key: 'role_manage',
                    value: JSON.stringify(this.queryData)
                });


                //数据渲染
                this.tableData = data.data_list.values;
                this.tableKey = data.data_list.key;
                this.tableProps = ['index', 'name', 'operation'];

                // //渲染分页
                this.pageData.currentList = data.paging_data.limit * 1;
                this.pageData.currentPage = data.paging_data.offset * 1;
                this.pageData.currentTotal = data.paging_data.total * 1;
            }
        },
        created () {
            try {
                getRoleTreeData().then(({ data }) => {
                    this.optionList.resourceList = data.data_list.resource_data;
                })
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
