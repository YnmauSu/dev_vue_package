<template>
    <div class="ui-main-module">
        <transition name="slide-fade">
            <div class="ui-search-area" v-if="showSearch">
                <ul class="ui-main-module-search clearFix">
                    <li>
                        <SearchRequirement label="名称">
                            <el-input size="small" v-model.trim="queryData.name"></el-input>
                        </SearchRequirement>
                    </li>
                    <li>
                        <SearchRequirement label="播放类型" v-model.trim="queryData.playType" template="select" :options="optionList.playTypeList">
                        </SearchRequirement>
                    </li>
                    <li>
                        <SearchRequirement label="播放模式" v-model.trim="queryData.playMode" template="select" :options="optionList.playModeList">
                        </SearchRequirement>
                    </li>
                    <li>
                        <SearchRequirement label="是否显示" v-model.trim="queryData.state" template="select" :options="optionList.isShowList">
                        </SearchRequirement>
                    </li>
                </ul>
                <FilterBtn refTable="myTable" :resetFn="handleResetQueryInfo" :queryFn="handleQueryInfo" :params="{limit: pageData.currentList}"></FilterBtn>
            </div>
        </transition>
        <div class="ui-fn-module">
            <span class="ui-top_i" @click="showSearch = !showSearch"><ComIcon
                    :name="showSearch ? 'shrink_up' : 'shrink_down'"></ComIcon></span>
            <el-button type="text" size="small" @click="handleEdit()">添加</el-button>
            <el-button type="text" size="small" @click="handleToggleState(null, 1)">批量启用</el-button>
            <el-button type="text" size="small" @click="handleToggleState(null, 2)">批量禁用</el-button>
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
                <!--<el-button type="text" size="small" @click="handleDelete(scope.row)">删除</el-button>-->
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
                <el-form-item prop="name" label="名称">
                    <el-input v-model.trim="editData.name"></el-input>
                </el-form-item>
                <el-form-item prop="playType" label="模式类型">
                    <el-select v-model="editData.playType">
                        <el-option v-for="item in optionList.playTypeList" :label="item.value" :value="item.key" :key="item.key"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item prop="playMode" label="播放模式">
                    <el-select v-model="editData.playMode">
                        <el-option v-for="item in optionList.playModeList" :label="item.value" :value="item.key" :key="item.key"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item prop="isShow" label="是否显示">
                    <el-select v-model="editData.isShow">
                        <el-option v-for="item in optionList.isShowList" :label="item.value" :value="item.key" :key="item.key"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item prop="linkType" label="链接类型">
                    <el-select v-model="editData.linkType">
                        <el-option v-for="item in optionList.linkTypeList" :label="item.value" :value="item.key" :key="item.key"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item prop="linkUrl" label="链接地址">
                    <el-input v-model.trim="editData.linkUrl"></el-input>
                </el-form-item>
                <el-form-item prop="imgUrl" label="图片地址">
                    <el-input v-model.trim="editData.imgUrl"></el-input>
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
        getSpreadPageInfo,
        addSpreadInfo,
        modifySpreadInfo,
        toggleSpreadState,
    } from '@/api/temp_module/spread_page'
    import {
        autoAddTableInx,
    } from '@/services/index';
    import {
        mapGetters
    } from 'vuex';

    // 组件名称，用于keep-alive和权限
    const component_name = 'spread_page';
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
                    name: '',
                    playMode: '',
                    state: '',
                    playType: '',
                },

                optionList: {
                    playModeList: [],
                    linkTypeList: [],
                    playTypeList: [],
                    isShowList: [],
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
                    name: '',
                    playType: '',
                    playMode: '',
                    isShow: '',
                    linkType: '',
                    linkUrl: '',
                    imgUrl: '',
                },

                editRule: {
                    playMode: CONFIG.RULE_CONFIG.requiredChange,
                    name: CONFIG.RULE_CONFIG.requiredBlur,
                    playType: CONFIG.RULE_CONFIG.requiredChange,
                    isShow: CONFIG.RULE_CONFIG.requiredChange,
                    linkType: CONFIG.RULE_CONFIG.requiredChange,
                    linkUrl: CONFIG.RULE_CONFIG.requiredBlur,
                    imgUrl: CONFIG.RULE_CONFIG.requiredBlur,
                }
            };
        },
        computed: {
            ...mapGetters([
                'queryParamsInfo'
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
                    this.queryData = JSON.parse(this.queryParamsInfo['spread_page']);
                }

                let obj = {
                    name: this.queryData.name,
                    module_type: this.queryData.playType,
                    pattern: this.queryData.playMode,
                    is_show: this.queryData.state,
                    ...params
                };

                getSpreadPageInfo(obj).then(({data}) => {

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
                    playMode: '',
                    state: '',
                    playType: '',
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

            // 切换状态
            handleToggleState(row, type) {
                let obj = {
                    is_show: type
                };
                if (!row) {
                    if (!this.saveCheckInfo.length) {
                        this.$message.warning('请勾选数据！');
                        return;
                    }
                    obj.ids = JSON.stringify(this.saveCheckInfo.map(item => item.id));
                } else {
                    obj.ids = row.id;
                }
                this.$confirm(`确认${type == 1 ? '启用' : '禁用'}该数据吗？`, '提示', {
                    type: "warning"
                }).then(() => {
                    toggleSpreadState(obj).then(({ data }) => {
                        this.handleOperationCallBack(data);
                    })
                });
            },

            // 编辑
            handleEdit(row) {
                this.dialog.add = true;
                if (row) {
                    this.dialog.edit = true;
                    this.editData.isShow = row.is_show;
                    this.editData.linkType = row.link_type;
                    this.editData.linkUrl = row.link_url;
                    this.editData.playType = row.module_type;
                    this.editData.playMode = row.pattern;
                    this.editData.name = row.name;
                    this.editData.imgUrl = row.pic_url;
                    this.saveCheckRow = row;
                }
            },

            // 取消编辑
            handleCancelEdit() {
                this.editData = {
                    name: '',
                    playType: '',
                    playMode: '',
                    isShow: '',
                    linkType: '',
                    linkUrl: '',
                    imgUrl: '',
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
                            name: this.editData.name, 	      //名称
                            module_type: this.editData.playType,   //模块类型 1 首页 2 频道  3 广告
                            pattern: this.editData.playMode,       //播放模式 1 非精选  2 精选
                            is_show : this.editData.isShow,      //是否显示  1 是  2 否
                            link_type: this.editData.linkType,     //链接类型
                            link_url: this.editData.linkUrl,      //链接地址
                            pic_url: this.editData.imgUrl,       //图片地址
                        };

                        if (this.dialog.edit) {
                            obj.id = this.saveCheckRow.id;
                            modifySpreadInfo(obj).then(({ data }) => {
                                this.handleOperationCallBack(data, this.handleCancelEdit)
                            })
                        } else {
                            addSpreadInfo(obj).then(({ data }) => {
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
                    key: 'spread_page',
                    value: JSON.stringify(this.queryData)
                });


                //数据渲染
                this.tableData = data.data_list.values;
                this.tableKey = data.data_list.key;
                this.tableProps = ['index', 'name', 'link_type_cn', 'is_show_cn',  'pattern_cn',   'link_url', 'operation'];
                this.tableWidth[2] = '100';
                this.tableWidth[3] = '100';


                this.optionList.playModeList = data.drop_down_box.pattern_list;
                this.optionList.playTypeList = data.drop_down_box.module_type_list;
                this.optionList.isShowList = data.drop_down_box.yes_no_list;
                this.optionList.linkTypeList = data.drop_down_box.link_type_list;

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
