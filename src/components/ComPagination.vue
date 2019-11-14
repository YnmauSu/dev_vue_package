<template>
    <div class="footer-box">
        <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="currentPage"
            :page-sizes="pageSizes"
            :page-size="pageSize"
            :layout="layout"
            :pager-count="pagerCount"
            :total="total">
        </el-pagination>
        <!--<p v-if="checkNumShow">当前选中<span class="text-blue">{{checkNum.length}}</span>条</p>-->
    </div>
</template>

<script>

export default {
    name: 'ComPagination',
    props: {
        currentPage: '',
        pageSizes: '',
        pageSize: '',
        layout: {
            type: String,
            default: 'total, sizes, prev, pager, next, jumper'
        },
        total: '',
        checkNumShow:{
            type:Boolean,
            default:true,
        },
        checkNum:{
            type:Array,
            default(){
                return []
            },
        },
        pagerCount:{
            type:Number,
            default:7
        },
    },
    methods: {
        handleSizeChange (val) {
            this.$emit('sizeChange', val);
        },
        handleCurrentChange (val) {
            this.$emit('currentChange', val);
        }
    },
   


};
</script>
<style scoped lang="less">
.footer-box {
    display: flex;
    align-items: center;

    p {
        margin-left: 10px;
        color: #606266;
        font-size: 14px;

        .text-blue {
            color: #6facff;
            margin: 0px 10px;
        }
    }

}
</style>
