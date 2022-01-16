<template>
    <div class="app-wrap">
        <LayoutTop class="layout-top"></LayoutTop>
        <LayoutContent class="layout-content"></LayoutContent>
    </div>
</template>

<script>
import LayoutContent from './layout-content'
import LayoutTop from './layout-top'
export default {
    components: { LayoutTop, LayoutContent }
}
</script>

<style lang="scss">
.app-wrap {
    height: 100vh;
    width: 100vw;
    display: flex;
    flex-direction: column;
    position: relative;
    background: transparent;
    @include bg_img('~@/assets/img/bg.png');
    .layout-top {
        height: 80px;
        position: relative;
        top: 0;
        left: 0;
        z-index: 9;
    }
    .layout-content {
        flex: 1;
    }
}
</style>
