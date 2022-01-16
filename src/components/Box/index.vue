<template>
    <div class="border">
        <div class="title-card">
            {{ title }}
        </div>
        <div class="slot">
            <slot></slot>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        title: {
            type: String
        }
    }
}
</script>

<style lang="scss" scoped>
.border {
    height: 100%;
    box-sizing: border-box;
    position: relative;
    display: flex;
    flex-direction: column;
    padding: 20px;
    font-size: 14px;
    // @include bg_img('~@/assets/img/box.png');
    background-color: rgba(7, 20, 40, 0.7);

    .title-card {
        position: absolute;
        top: 10px;
        width: calc(100% - 40px);
        left: 50%;
        transform: translate(-50%, 0);
        text-align: center;
        letter-spacing: 1px;
        font-weight: bold;
    }
    .slot {
        margin-top: 20px;
        width: 100%;
        flex: 1;
        overflow: hidden;
    }
}
</style>
