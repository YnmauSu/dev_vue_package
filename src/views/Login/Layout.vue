<template>
    <div>
        <!--<LoginNavBar></LoginNavBar>-->
        <div>
            <LoginMain></LoginMain>
        </div>
        <Loading></Loading>
    </div>
</template>

<script>
    import {
        LoginMain,
        // LoginNavBar,
    } from './index'
    export default {
        name: "Layout",
        components: {
            LoginMain,
            // LoginNavBar
        }
    }
</script>

<style scoped>

</style>
