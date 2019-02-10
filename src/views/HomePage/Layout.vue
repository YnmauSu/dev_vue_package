<template>
    <div class="ui-main ui-theme_default">
        <div class="ui-nav">
            <Navbar></Navbar>
        </div>
        <div class="ui-content">
            <Main></Main>
        </div>
        <Loading></Loading>
    </div>
</template>

<script>
    import {
        Navbar,
        Main,
        Sidebar
    } from '@/views/HomePage'
    export default {
        name: "Layout",
        components: {
            Navbar,
            Main,
            Sidebar
        }
    }
</script>

<style scoped>

</style>