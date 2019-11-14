<template>
    <div class="ui-main-module">
        <transition name="slide-fade">
            <div class="ui-search-area" v-if="showSearch">
                <ul class="ui-main-module-search clearFix">
                    <li>
                        <SearchRequirement label="用户昵称">
                            <el-input size="small" v-model.trim="queryData.userName"></el-input>
                        </SearchRequirement>
                    </li>
                    <li>
                        <SearchRequirement label="手机号">
                            <el-input size="small" v-model.trim="queryData.phone"></el-input>
                        </SearchRequirement>
                    </li>
                    <li>
                        <SearchRequirement label="推广码">
                            <el-input size="small" v-model.trim="queryData.code"></el-input>
                        </SearchRequirement>
                    </li>
                    <li>
                        <SearchRequirement label="是否VIP">
                            <el-select size="small" v-model.trim="queryData.isVip">
                                <el-option label="是" value="1"></el-option>
                                <el-option label="否" value="2"></el-option>
                            </el-select>
                        </SearchRequirement>
                    </li>
                </ul>
                <FilterBtn refTable="myTable" :resetFn="handleResetQueryInfo" :queryFn="handleQueryInfo" :params="{limit: pageData.currentList}"></FilterBtn>
            </div>
        </transition>
        <div class="ui-fn-module">
            <span class="ui-top_i" @click="showSearch = !showSearch"><ComIcon
                    :name="showSearch ? 'shrink_up' : 'shrink_down'"></ComIcon></span>
            <el-button type="text" size="small" @click="handleToggleState(1)">批量启用</el-button>
            <el-button type="text" size="small" @click="handleToggleState(2)">批量禁用</el-button>
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
                <!--<el-button type="text" size="small" @click="handleToggleState(scope.row)">-->
                    <!--{{scope.row.status === '2' ? '启用' : '禁用'}}-->
                <!--</el-button>-->
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
                title="编辑"
                width="400px"
                top="3vh"
                :close-on-click-modal="false"
                :show.sync="dialog.add" @close="handleCancelEdit">
            <el-form ref="editModel" label-width="100px" :model="editData" :rules="editRule" size="small">
                <el-form-item prop="userName" label="用户昵称">
                    <el-input v-model.trim="editData.userName"></el-input>
                </el-form-item>
                <el-form-item prop="isVIP" label="是否VIP">
                    <el-select v-model="editData.isVIP">
                        <el-option label="是" value="1"></el-option>
                        <el-option label="否" value="2"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item prop="VIPEndTime" label="VIP到期时间">
                    <el-date-picker
                            v-model="editData.VIPEndTime"
                            type="datetime"
                            placeholder="选择日期时间">
                    </el-date-picker>
                </el-form-item>
                <el-form-item prop="surplusWTVN" label="剩余观影次数">
                    <el-input v-model.trim="editData.surplusWTVN"></el-input>
                </el-form-item>
                <el-form-item prop="accountState" label="账号状态">
                    <el-select v-model="editData.accountState">
                        <el-option label="正常" value="1"></el-option>
                        <el-option label="禁用" value="2"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item prop="isRecommend" label="是否推荐精选">
                    <el-select v-model="editData.isRecommend">
                        <el-option label="否" value="1"></el-option>
                        <el-option label="是" value="2"></el-option>
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
        getClientManageInfo,
        updateClientManageInfo,
        modifyUserState
    } from '@/api/user_manage/client_manage'
    import {
        autoAddTableInx,
    } from '@/services/index';
    import {
        mapGetters
    } from 'vuex';

    // 组件名称，用于keep-alive和权限
    const component_name = 'client_manage';
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
                    userName: '',
                    phone: '',
                    code: '',
                    isVip: '',
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
                    userName: '',
                    isVIP: '',
                    VIPEndTime: '',
                    surplusWTVN: '',
                    accountState: '',
                    isRecommend: '',
                },

                editRule: {
                    userName: CONFIG.RULE_CONFIG.requiredBlur,
                    isVIP: CONFIG.RULE_CONFIG.requiredChange,
                    VIPEndTime: CONFIG.RULE_CONFIG.requiredChange,
                    surplusWTVN: CONFIG.RULE_CONFIG.requiredBlur,
                    accountState: CONFIG.RULE_CONFIG.requiredChange,
                    isRecommend: CONFIG.RULE_CONFIG.requiredChange,
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
                    this.queryData = JSON.parse(this.queryParamsInfo['client_manage']);
                }

                let obj = {
                    user_name: this.queryData.userName,
                    tel: this.queryData.phone,
                    promo_code: this.queryData.code,
                    is_vip: this.queryData.isVip,
                    ...params
                };

                getClientManageInfo(obj).then(({data}) => {

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
                    userName: '',
                    phone: '',
                    code: '',
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

            // 修改状态
            handleToggleState(type) {
                if (!this.saveCheckInfo.length) {
                    this.$message.warning('请勾选数据！');
                    return;
                }
                this.$confirm(`确认${type === 1 ? '启用' : '禁用'}吗？`, '提示', {
                    type: "warning"
                }).then(() => {
                    let obj = {
                        ids: JSON.stringify(this.saveCheckInfo.map(item => item.id)),
                        status: type,
                    }
                    modifyUserState(obj).then(({ data }) => {
                        this.handleOperationCallBack(data);
                    })
                });
            },

            // 编辑
            handleEdit(row) {
                this.dialog.add = true;
                if (row) {
                    this.editData.userName = row.user_name;
                    this.editData.isVIP = row.is_vip;
                    this.editData.isRecommend = row.is_rmd;
                    this.editData.VIPEndTime = row.vip_end_time;
                    this.editData.surplusWTVN = row.viewing_number;
                    this.editData.accountState = row.status;
                    this.saveCheckRow = row;
                }
            },

            // 取消编辑
            handleCancelEdit() {
                this.editData = {
                    userName: '',
                    isVIP: '',
                    VIPEndTime: '',
                    surplusWTVN: '',
                    accountState: '',
                    isRecommend: '',
                }
                this.dialog.add = false;
                this.$nextTick().then(() => {
                    this.$refs.editModel.resetFields();
                })
            },

            // 确认编辑
            handleConfirmEdit() {
                this.$refs.editModel.validate(res => {
                    if (res) {
                        let obj = {
                            id: this.saveCheckRow.id,
                            user_name: this.editData.userName,
                            is_vip: this.editData.isVIP,
                            vip_end_time: this.editData.VIPEndTime,
                            viewing_number: this.editData.surplusWTVN,
                            status: this.editData.accountState,
                            is_rmd: this.editData.isRecommend,
                        };

                        updateClientManageInfo(obj).then(({ data }) => {
                            this.handleOperationCallBack(data, this.handleCancelEdit);
                        })
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
                    key: 'client_manage',
                    value: JSON.stringify(this.queryData)
                });


                //数据渲染
                this.tableData = data.data_list.values;
                this.tableKey = ['序号', ...data.data_list.key, '操作'];
                this.tableProps = ['index', 'user_name', 'tel', 'is_vip_cn', 'vip_end_time', 'promo_code', 'promo_number', 'viewing_number', 'watch_number',  'is_rmd_cn', 'handset_code', 'operation'];
                this.tableWidth[4] = '180';

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
