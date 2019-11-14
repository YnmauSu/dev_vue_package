<template>
    <div class="ui-main-module">
        <transition name="slide-fade">
            <div class="ui-search-area" v-if="showSearch">
                <ul class="ui-main-module-search clearFix">
                    <li>
                        <SearchRequirement label="视频名称">
                            <el-input size="small" v-model.trim="queryData.videoName"></el-input>
                        </SearchRequirement>
                    </li>
                    <li>
                        <SearchRequirement label="播放模式" v-model="queryData.playMode" template="select" :options="optionList.playModeList">
                        </SearchRequirement>
                    </li>
                    <li>
                        <SearchRequirement label="分类" v-model="queryData.classify" template="select" :options="optionList.classifyList">
                        </SearchRequirement>
                    </li>
                    <!--<li>-->
                        <!--<SearchRequirement label="是否上架" v-model="queryData.isPush" template="select" :options="optionList.isPushList">-->
                        <!--</SearchRequirement>-->
                    <!--</li>-->
                </ul>
                <FilterBtn refTable="myTable" :resetFn="handleResetQueryInfo" :queryFn="handleQueryInfo" :params="{limit: pageData.currentList}"></FilterBtn>
            </div>
        </transition>
        <div class="ui-fn-module">
            <span class="ui-top_i" @click="showSearch = !showSearch"><ComIcon
                    :name="showSearch ? 'shrink_up' : 'shrink_down'"></ComIcon></span>
            <el-button type="text" size="small" @click="handleEdit()">添加视频</el-button>
            <el-button type="text" size="small" v-if="queryData.isPush == 0" @click="handlePushOpe(1)">批量上架</el-button>
            <el-button type="text" size="small" v-else @click="handlePushOpe(0)">批量下架</el-button>
        </div>
        <ComTableInfo
                isCheck
                :tableKey="tableKey"
                :tableProps="tableProps"
                :tableData="tableData"
                :tableWidth="tableWidth"
                :showSearch="showSearch"
                @checked="handleSaveCheckInfo">
            <div class="ui-main-tab">
                <el-badge
                        v-for="(item, index) in optionList.moduleTypeList"
                        :key="index">
                    <li class="ui-main-tab-box">
                        <span @click="handleToggleTableInfo(item.value)"
                              :class="queryData.isPush === item.value && 'ui-active'">{{item.label}}<i
                                class="ui-tab_line"></i></span>
                    </li>
                </el-badge>
            </div>
            <template slot="operation" slot-scope="scope">
                <el-button type="text" size="small" @click="handleEdit(scope.row)">编辑</el-button>
                <el-button type="text" size="small" @click="handlePushOpe(scope.row.is_push == 1 ? 0 : 1, scope.row)">{{scope.row.is_push == 1 ? '下架' : '上架'}}</el-button>
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
                <el-form-item prop="videoName" label="视频名称">
                    <el-input v-model.trim="editData.videoName"></el-input>
                </el-form-item>
                <el-form-item prop="videoDec" label="视频描述">
                    <el-input type="textarea" v-model.trim="editData.videoDec"></el-input>
                </el-form-item>
                <el-form-item prop="videoUrl" label="视频地址">
                    <el-input v-model.trim="editData.videoUrl"></el-input>
                </el-form-item>
                <el-form-item prop="playMode" label="播放模式">
                    <el-select v-model="editData.playMode">
                        <el-option v-for="item in optionList.playModeList" :label="item.value" :value="item.key" :key="item.key"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item prop="classify" label="分类">
                    <el-select v-model="editData.classify">
                        <el-option v-for="item in optionList.classifyList" :label="item.value" :value="item.key" :key="item.key"></el-option>
                    </el-select>
                </el-form-item>

                <el-form-item prop="videoImage" label="封面图片链接">
                    <el-input v-model.trim="editData.videoImage"></el-input>
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
        getVideoListInfo,
        addVideoInfo,
        modifyVideoInfo,
        togglePushInfo,
    } from '@/api/temp_module/video_list'
    import {
        autoAddTableInx,
    } from '@/services/index';
    import {
        mapGetters
    } from 'vuex';

    // 组件名称，用于keep-alive和权限
    const component_name = 'video_list';
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
                    videoName: '',
                    playMode: '',
                    classify: '',
                    isPush: '1',
                },

                optionList: {
                    playModeList: [],
                    classifyList: [],
                    isPushList: [
                        {
                            key: '0',
                            value: '否'
                        },
                        {
                            key: '1',
                            value: '是'
                        }
                    ],
                    moduleTypeList: [
                        {
                            label: '上架',
                            value: '1',
                        },
                        {
                            label: '未上架',
                            value: '0'
                        }
                    ]
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
                    videoName: '',
                    videoDec: '',
                    videoUrl: '',
                    playMode: '',
                    classify: '',
                    videoImage: '',
                },

                editRule: {
                    videoName: CONFIG.RULE_CONFIG.requiredBlur,
                    videoDec: CONFIG.RULE_CONFIG.requiredBlur,
                    videoUrl: CONFIG.RULE_CONFIG.requiredBlur,
                    playMode: CONFIG.RULE_CONFIG.requiredChange,
                    classify: CONFIG.RULE_CONFIG.requiredChange,
                    videoImage: CONFIG.RULE_CONFIG.requiredBlur
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
                    this.queryData = JSON.parse(this.queryParamsInfo['video_list']);
                }

                let obj = {
                    video_name: this.queryData.videoName,
                    pattern: this.queryData.playMode,
                    playMode: this.queryData.classify,
                    is_push: this.queryData.isPush,
                    ...params
                };

                getVideoListInfo(obj).then(({data}) => {

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
                    videoName: '',
                    playMode: '',
                    classify: '',
                    isPush: '',
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

            // 切换表格信息
            handleToggleTableInfo(val) {
                  this.queryData.isPush = val;
                this.handleQueryInfo({limit: this.pageData.currentList});
            },

            // 删除
            handlePushOpe(type, row) {
                let obj = {
                    is_push: type
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
                this.$confirm(`确认${type == 1 ? '上架' : '下架'}吗？`, '提示', {
                    type: "warning"
                }).then(() => {
                    togglePushInfo(obj).then(({ data }) => {
                        this.handleOperationCallBack(data);
                    })
                });
            },

            // 编辑
            handleEdit(row) {
                this.dialog.add = true;
                if (row) {
                    this.editData.videoName = row.video_name;
                    this.editData.videoDec = row.brief_content;
                    this.editData.videoUrl = row.video_url;
                    this.editData.playMode = row.pattern;
                    this.editData.classify = row.classify_id;
                    this.editData.videoImage = row.video_cover_url;
                    this.saveCheckRow = row;
                    this.dialog.edit = true;
                }
            },

            // 取消编辑
            handleCancelEdit() {
                this.editData = {
                    videoName: '',
                    videoDec: '',
                    videoUrl: '',
                    playMode: '',
                    classify: '',
                    videoImage: '',
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
                            video_name: this.editData.videoName,
                            brief_content: this.editData.videoDec,
                            video_url: this.editData.videoUrl,
                            pattern: this.editData.playMode,
                            classify_id: this.editData.classify,
                            video_cover_url: this.editData.videoImage,
                        };
                        if (this.dialog.edit) {
                            obj.id = this.saveCheckRow.id;
                            modifyVideoInfo(obj).then(({ data }) => {
                                this.handleOperationCallBack(data, this.handleCancelEdit)
                            })
                        } else {
                            addVideoInfo(obj).then(({ data }) => {
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
                    key: 'video_list',
                    value: JSON.stringify(this.queryData)
                });


                //数据渲染
                this.tableData = data.data_list.values;
                this.tableKey = data.data_list.key;
                this.tableProps = ['index', 'video_name', 'classify_cn', 'video_url', 'push_time', 'play_num',  'pattern_cn', 'operation'];
                // this.tableWidth[2] = '100';
                // this.tableWidth[3] = '100';


                this.optionList.playModeList = data.drop_down_box.pattern_list
                this.optionList.classifyList = data.drop_down_box.video_class_list

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
    /*.ui-main-tab {*/
        /*margin: 0 0 15px 0;*/
        /*border-bottom: 1px solid #e6e6e6;*/
    /*}*/
</style>
