<template>
    <div id="app">
        <router-view />
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
    computed: {
        ...mapGetters(['theme'])
    },
    watch: {
        theme: {
            handler(n, o) {
                if (o !== n) {
                    window.document.documentElement.setAttribute('data-theme', n)
                }
            },
            immediate: true
        }
    }
}
</script>

<style lang="scss">
@import '~@/assets/css/index.scss';
#app {
    @include background_color('color1');
    @include font_color('color2');
    height: 100vh;
    width: 100vw;
}
</style>
