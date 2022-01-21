<template>
    <div class="province">
        <template v-if="show">
            <ProvinceCenter :center="center" :provinceId="provinceId" class="province-center" />
        </template>
    </div>
</template>

<script>
import ProvinceCenter from './components/province-center.vue'
import { mapActions } from 'vuex'
export default {
    name: 'Province',
    components: {
        ProvinceCenter
    },
    data() {
        return {
            provinceId: null,
            center: null,
            show: false
        }
    },
    created() {
        this.provinceId = this.$route.query.id
        this.center = this.$route.query.center
        this.SET_DATA().then(() => {
            this.SET_PROVINCE(this.provinceId).then(() => {
                this.show = true
            })
        })
    },
    methods: {
        ...mapActions(['SET_DATA', 'SET_PROVINCE'])
    }
}
</script>

<style lang="scss" scoped>
.province {
    height: 100%;
    width: 100%;
    position: relative;
    overflow: hidden;
    .province-left {
        width: 25vw;
        height: 100%;
        position: absolute;
        left: 0;
        z-index: 2;
    }
    .province-center {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 1;
    }
    .province-right {
        width: 25vw;
        height: 100%;
        position: absolute;
        right: 0;
        z-index: 2;
    }
}
</style>
