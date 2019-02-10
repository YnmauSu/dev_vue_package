<template>
    <div class="ui-loading" v-loading.fullscreen.lock="showLoading"></div>
</template>

<script>
    import { mapGetters } from 'vuex';
    export default {
        name: 'Loading',
        data () {
            return {};
        },
        props: [ 'loading' ],
        computed: {
            ...mapGetters(['showLoading']),
            Loading: function () {
                return this.loading;
            }
        }
    };
</script>

<style scoped>
    .ui-loading {
        background: #333333;
        opacity: 0.3;
    }
</style>
