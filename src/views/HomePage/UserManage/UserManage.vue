<template>
    <div class="ui-main-module">
        <transition name="slide-fade">
            <div class="ui-search-area" v-if="showSearch">
                <ul class="ui-main-module-search clearFix">
                    <li>
                        <SearchRequirement label="昵称">
                            <el-input size="small" v-model.trim="queryData.name"></el-input>
                        </SearchRequirement>
                    </li>
                    <li>
                        <SearchRequirement label="手机号">
                            <el-input size="small" v-model.trim="queryData.phone"></el-input>
                        </SearchRequirement>
                    </li>
                    <li>
                        <SearchRequirement label="邀请码">
                            <el-input size="small" v-model.trim="queryData.inviteCode"></el-input>
                        </SearchRequirement>
                    </li>
                    <li>
                        <SearchRequirement label="是否为VIP" template="select"
                                           :options="{'1': '是', '2': '否'}"
                                           v-model="queryData.isVip"></SearchRequirement>
                    </li>
                </ul>
                <FilterBtn refTable="myTable" :resetFn="handleResetQueryInfo" :queryFn="handleQueryInfo" :params="{limit: pageData.currentList}"></FilterBtn>
            </div>
        </transition>
        <div class="ui-fn-module">
            <span class="ui-top_i" @click="showSearch = !showSearch"><ComIcon
                    :name="showSearch ? 'shrink_up' : 'shrink_down'"></ComIcon></span>
            <el-button type="text" size="small" @click="handleEditUser()">新增用户</el-button>
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
                <el-button type="text" size="small" @click="handleEditUser(scope.row)">编辑</el-button>
                <el-button type="text" size="small" @click="handleToggleUserState(scope.row)">{{scope.row.status == 1 ? '禁用' : '启用'}}</el-button>
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
            <el-form ref="editModel" label-width="100px" :model="editData" :rules="editRule" size="small">
                <el-form-item prop="userName" label="用户名">
                    <el-input v-model.trim="editData.userName"></el-input>
                </el-form-item>
                <el-form-item prop="loginName" label="登录名">
                    <el-input :disabled="dialog.edit" v-model.trim="editData.loginName"></el-input>
                </el-form-item>
                <el-form-item prop="role" label="角色">
                    <el-select v-model="editData.role">
                        <el-option v-for="item in optionList.roleList"
                                   :label="item.value" :key="item.key" :value="item.key"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item v-if="!dialog.edit" prop="password" label="密码">
                    <el-input v-model.trim="editData.password" show-password></el-input>
                </el-form-item>
                <el-form-item v-if="!dialog.edit" prop="cpassword" label="确认密码">
                    <el-input v-model.trim="editData.cpassword" show-password></el-input>
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
        getUserInfoList,
        confirmAddUserInfo,
        confirmModifyUserInfo,
        toggleUserState
    } from '@/api/user_manage/user_manage'
    import {
        autoAddTableInx,
    } from '@/services/index';
    import {
        mapActions,
        mapGetters
    } from 'vuex';

    // 组件名称，用于keep-alive和权限
    const component_name = 'user_manage';
    export default {
        name: component_name,
        components: {
        },
        data () {

            let validatePass = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请输入密码'));
                } else {
                    if (this.editData.cpassword !== '') {
                        this.$refs.editModel.validateField('cpassword');
                    }
                    callback();
                }
            };

            let validatePass2 = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请再次输入密码'));
                } else if (value !== this.editData.password) {
                    callback(new Error('两次输入密码不一致!'));
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
                    name: '',
                    phone: '',
                    inviteCode: '',
                    isVip: '',
                },

                optionList: {
                    roleList: []
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

                editData: {
                    userName: '',
                    loginName: '',
                    role: '',
                    password: '',
                    cpassword: '',
                },

                editRule: {
                    userName: CONFIG.RULE_CONFIG.requiredBlur,
                    loginName: CONFIG.RULE_CONFIG.requiredBlur,
                    password: [
                        {
                            validator: validatePass,
                            trigger: 'blur'
                        },
                        ...CONFIG.RULE_CONFIG.requiredBlur,
                        CONFIG.RULE_CONFIG.password
                    ],
                    cpassword: [
                        {
                            validator: validatePass2,
                            trigger: 'blur'
                        },
                        ...CONFIG.RULE_CONFIG.requiredBlur,
                        CONFIG.RULE_CONFIG.password
                    ],
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
                    this.queryData = JSON.parse(this.queryParamsInfo['user_manage']);
                }

                let obj = {
                    user_name: '',
                    role_id: '',
                    ...params
                };

                getUserInfoList(obj).then(({data}) => {

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
                    name: '',
                    phone: '',
                    inviteCode: '',
                    isVip: '',
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

            // 切换用户状态
            handleToggleUserState(row) {
                this.$confirm(`确认${row.status == 1 ? '禁用' : '启用'}吗？`, '提示', {
                    type: "warning"
                }).then(() => {
                    let obj = {
                        user_id: row.user_id,
                        status: row.status == 1 ? '2' : '1'
                    }
                    toggleUserState(obj).then(({ data }) => {
                        this.handleOperationCallBack(data);
                    })
                });
            },

            // 点击新增用户
            handleEditUser(row) {
                this.dialog.add = true;
                if (row) {
                    this.dialog.edit = true;
                    this.editData.userName = row.user_name;
                    this.editData.loginName = row.login_name;
                    this.editData.role = row.role_id;
                }
            },

            // 取消编辑
            handleCancelEdit() {
                this.editData = {
                    userName: '',
                    loginName: '',
                    role: '',
                    password: '',
                    cpassword: '',
                }
                this.dialog.add = false;
                this.dialog.edit = false;
                this.$refs.editModel.resetFields();
            },

            // 确认编辑
            handleConfirmEdit() {
                this.$refs.editModel.validate(res => {
                    if (res) {
                        let obj = {
                            user_name: this.editData.userName,
                            login_name: this.editData.loginName,
                            role_id: this.editData.role,
                            login_pwd: this.editData.password
                        };

                        if (this.dialog.edit) {
                            confirmModifyUserInfo(obj).then(({ data }) => {
                                this.handleOperationCallBack(data, this.handleCancelEdit);
                            })
                        } else {
                            confirmAddUserInfo(obj).then(({ data }) => {
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
                    key: 'user_manage',
                    value: JSON.stringify(this.queryData)
                });


                //数据渲染
                this.tableData = data.data_list.values;
                this.tableKey = data.data_list.key;
                this.tableProps = ['user_name', 'login_name', 'name', 'operation'];

                this.optionList.roleList = data.drop_down_box.role_list;

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
