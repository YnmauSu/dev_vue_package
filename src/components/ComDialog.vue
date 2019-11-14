<template>
    <el-dialog
            class="ui-layout_edit-dialog"
            custom-class="ui-com_edit"
            top="3vh"
            :title="title"
            :width="width"
            :close-on-click-modal="closeOnClickModal"
            :visible="show"
            @close="handleClose">
        <slot></slot>
        <div slot="footer" class="ui-com_edit--btn">
            <slot name="footer"></slot>
        </div>
    </el-dialog>
</template>

<script>
    export default {
        name: "ComDialog",
        props: {
            title: {
                type: String,
                default: '标题'
            },
            width: {
                type: String,
                default: '1000px'
            },
            show: {
                type: Boolean,
                default: false
            },
            closeOnClickModal: {
                type: Boolean,
                default: true
            }
        },
        methods: {
            handleClose(val) {
                this.$emit('close', val);
                this.$emit('update:show', false);
            }
        }
    }
</script>

<style scoped>

</style>