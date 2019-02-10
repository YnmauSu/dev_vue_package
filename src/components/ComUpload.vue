<template>
    <div class="ui-upload">
        <el-upload
                :show-file-list="false"
                :action="url"
                :on-change="handleChange"
                :on-success="autoUploadSuccess"
                :on-error="autoUploadError"
                :before-upload="beforeAvatarUpload"
                :disabled="isDisabled"
                :data="upData">
            <el-button size="small" type="primary" :disabled="isDisabled">{{ label }}</el-button>
        </el-upload>
    </div>
</template>

<script>
    export default {
        name: "ComUpload",
        props: {
            url: {
                type: String,
                default: '/'
            },
            label: {
                type: String,
                default: '上传'
            },
            isDisabled: {
                type: Boolean,
                default: false
            },
            fileSize: {
                type: Number,
                default: 2
            },
            upData: {
                type: Object,
                default() {
                    return {}
                }
            }
        },
        data() {
            return {

            }
        },
        methods: {
            handleChange(file, fileList) {
                console.log(file, fileList)
            },

            // 上传成功
            autoUploadSuccess(res) {
                if (res.status) {
                    this.$message({
                        type: 'success',
                        message: '上传成功'
                    });
                    this.$emit('success', 1);
                } else {
                    let str = '';
                    for (let i = 0; i < res.errorMess_data.length; i++) {
                        str += `<div>${res.errorMess_data[i]}</div>`;
                    }
                    if (res.errorMess) {
                        this.$alert(str, res.errorMess || '错误原因', {
                            customClass: 'ui-error-list',
                            dangerouslyUseHTMLString: true
                        });
                    }

                    this.$message({
                        type: 'error',
                        message: '上传失败'
                    })
                }
            },

            // 文件校验
            beforeAvatarUpload(file) {
                const isType = file.name.substring(file.name.lastIndexOf('.') + 1, file.name.length);
                const isTrueType = isType === 'csv' || isType === 'xls' || isType === 'xlsx';
                const isSize = file.size / 1024 / 1024 < this.fileSize;

                if (!isTrueType) {
                    this.$message.error('仅支持（“xls”和“xlsx”）文件！');
                }

                if (!isSize) {
                    this.$message.error(`上传头像图片大小不能超过 ${this.fileSize}MB!`);
                }

                return isTrueType && isSize;
            },

            // 上传失败
            autoUploadError(err) {
                this.$message({
                    type: 'error',
                    message: err || '上传失败'
                })
            }
        }
    }
</script>

<style scoped>
    .ui-upload {
        display: inline-block;
        margin-right: 10px;
    }
</style>