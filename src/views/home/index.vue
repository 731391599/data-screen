<template>
    <div class="home">
        <template v-if="show">
            <HomeLeft class="home-left" />
            <HomeCenter class="home-center" />
            <HomeRight class="home-right" />
        </template>
    </div>
</template>

<script>
import HomeCenter from './components/home-center.vue'
import HomeLeft from './components/home-left.vue'
import HomeRight from './components/home-right.vue'
import { mapActions, mapGetters } from 'vuex'
export default {
    name: 'Home',
    components: {
        HomeCenter,
        HomeLeft,
        HomeRight
    },
    data() {
        return {
            show: false
        }
    },
    computed: {
        ...mapGetters(['areaTree'])
    },
    created() {
        this.SET_DATA().then(res => {
            this.show = true
        })
    },
    methods: {
        ...mapActions(['SET_DATA'])
    }
}
</script>

<style lang="scss" scoped>
.home {
    height: 100%;
    width: 100%;
    position: relative;
    overflow: hidden;
    .home-left {
        width: 25vw;
        height: 100%;
        position: absolute;
        left: 0;
        z-index: 2;
    }
    .home-center {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 1;
    }
    .home-right {
        width: 25vw;
        height: 100%;
        position: absolute;
        right: 0;
        z-index: 2;
    }
}
</style>
