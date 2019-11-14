<template>
    <section class="s-main">
        <MultipleTab></MultipleTab>
        <keep-alive :include="keepAlive">
            <router-view></router-view>
        </keep-alive>
    </section>
</template>

<script>
    import { mapGetters } from 'vuex'
    import CONFIG from '@/assets/js/config'
    export default {
        name: "Main",
        data() {
            return {
                isInit: false
            }
        },
        computed: {
            ...mapGetters(['tabLabel']),
            key() {
                return this.$route.path !== undefined ? this.$route.path.replace('/', '') : this.$route;
            },
            keepAlive() {
                return this.tabLabel.map(item => item.path.replace('/', ''));
            }
        },
        mounted() {
        }
    }
</script>

<style scoped>

</style>