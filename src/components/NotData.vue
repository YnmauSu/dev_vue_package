<template>
    <div class="ui-not_data-txt">
        <img src="../assets/image/empty.png" alt="">
        <p>空空如也</p>
    </div>
</template>

<script>
    export default {
        name: "NotData",
        // props: ['isNotData'],
        // watch: {
        //     isNotData(val) {
        //         if (val) {
        //             this.$emit('changeState', true)
        //         } else {
        //             this.$emit('changeState', false)
        //         }
        //     }
        // }
    }
</script>

<style scoped lang="less">
    .ui-not_dat-txt {
        p {
            padding-top: 20px;
            /*margin-top: 10px;*/
        }
    }
</style>