<template>
    <TemplateDefault color="#FFFFFF">
        <div class="ui-head_ope">
            <el-button type="text" size="small" @click="handleEditResource()">新增根菜单</el-button>
        </div>
        <el-tree
                class="filter-tree"
                node-key="resource_id"
                :data="optionList.resourceList"
                :props="{label: 'menu_name'}"
                default-expand-all
                ref="roleTree">
            <div class="ui-tree-button clearFix" slot-scope="{ node, data }">
                <span>{{ node.label }}</span>
                <div class="f-r">
                    <el-button
                            type="text"
                            size="mini"
                            @click="handleEditResource(data, 1)">添加</el-button>
                    <el-button
                            type="text"
                            size="mini"
                            @click="handleEditResource(data, 2)">修改</el-button>
                    <el-button
                            type="text"
                            size="mini"
                            @click="handleDeleteResource(data)">删除</el-button>
                </div>
            </div>
        </el-tree>
        <com-dialog
                :title="saveType === 2 ? '修改' : '新增'"
                width="400px"
                top="3vh"
                :close-on-click-modal="false"
                :show.sync="dialog.add" @close="handleCancelEdit">
            <el-form ref="editModel" label-width="100px" :model="editData" :rules="editRule" size="small">
                <el-form-item prop="resName" label="资源名称">
                    <el-input v-model.trim="editData.resName"></el-input>
                </el-form-item>
                <el-form-item prop="resType" label="资源类型">
                    <el-select v-model="editData.resType">
                        <el-option label="菜单" value="1"></el-option>
                        <el-option label="按钮" value="2"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item prop="resValue" label="资源value">
                    <el-input v-model.trim="editData.resValue"></el-input>
                </el-form-item>
                <el-form-item prop="resPath" label="资源路径">
                    <el-input v-model.trim="editData.resPath"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="ui-com_edit--btn">
                <el-button size="small" @click="handleCancelEdit">取消</el-button>
                <el-button size="small" type="primary" @click="handleConfirmEdit">确认</el-button>
            </div>
        </com-dialog>
    </TemplateDefault>
</template>

<script>

    import {
        getResourceListInfo,
        addResourceInfo,
        modifyResourceInfo,
        deleteResourceInfo
    } from '@/api/manage_settle/resource_manage';
    import CONFIG from '@/assets/js/config'

    // 组件名称，用于keep-alive和权限
    const component_name = 'resource_manage';
    export default {
        name: component_name,
        data() {
            return {
                optionList: {
                    resourceList: []
                },
                dialog: {
                    add: false
                },
                editData: {
                    resName: '',
                    resType: '',
                    resValue: '',
                    resPath: '',
                },
                editRule: {
                    resName: CONFIG.RULE_CONFIG.requiredBlur,
                    resType: CONFIG.RULE_CONFIG.requiredChange,
                    resValue: CONFIG.RULE_CONFIG.requiredBlur,
                    resPath: CONFIG.RULE_CONFIG.requiredBlur
                },
                saveCheckRow: {},
                saveType: ''
            }
        },
        methods: {
            handleQueryInfo() {
                getResourceListInfo().then(({ data }) => {
                    console.log(data);
                    this.optionList.resourceList = data.data_list.resource_data;
                })
            },

            // 删除资源
            handleDeleteResource(data) {
                this.$confirm('确认删除该资源？', '提示', {
                    type: 'warning'
                }).then(() => {
                    deleteResourceInfo({
                        resource_id: data.resource_id
                    }).then(({ data }) => {
                        this.handleOperationCallBack(data);
                    })
                })
            },

            handleEditResource(data, type) {

                if (type === 2) {
                    this.editData.resPath = data.resource_path;
                    this.editData.resValue = data.resource_name;
                    this.editData.resType = data.resource_type;
                    this.editData.resName = data.menu_name;
                }

                if (data) {
                    this.saveCheckRow = data;
                }

                this.dialog.add = true;
                this.saveType = type;
            },

            // 确认编辑
            handleConfirmEdit() {
                this.$refs.editModel.validate(res => {
                    if (res) {
                        let obj = {
                            resource_type: this.editData.resType,
                            resource_name: this.editData.resValue,
                            menu_name: this.editData.resName,
                            resource_path: this.editData.resPath,
                            parent_id: this.saveType === 1 ? this.saveCheckRow.resource_id : this.saveType ? this.saveCheckRow.parent_id : '0',
                        }

                        if (this.saveType === 2) {
                            obj.resource_id = this.saveCheckRow.resource_id;
                            modifyResourceInfo(obj).then(({ data }) => {
                                this.handleOperationCallBack(data, () => {
                                    this.handleCancelEdit();
                                })
                            })
                        } else {
                            addResourceInfo(obj).then(({ data }) => {
                                this.handleOperationCallBack(data, () => {
                                    this.handleCancelEdit();
                                })
                            })
                        }
                    }
                })
            },

            // 取消编辑
            handleCancelEdit() {
                this.dialog.add = false;
                this.saveCheckRow = {};
                this.saveType = '';
                this.editData = {
                    resName: '',
                    resType: '',
                    resValue: '',
                    resPath: '',
                }
                this.$refs.editModel.resetFields();
            },

            // 操作回调
            handleOperationCallBack(data, callBack) {
                if (data.status) {
                    this.$message.success('操作成功！');
                    this.handleQueryInfo();
                    callBack && callBack();
                } else {
                    this.$message.error(data.errorMess || '操作失败！');
                }
            }
        },
        created() {
            this.handleQueryInfo();
        }
    }
</script>

<style scoped lang="less">
    .ui-head_ope {
        /*height: ;*/
        text-align: left;
        padding: 40px 0 0 20px;
        border-bottom: 1px solid #e6e6e6;
    }

    .ui-tree-button {
        font-size: 14px;
        width: 100%;
        text-align: left;
        line-height: 28px;
        padding-right: 100px;
    }
</style>