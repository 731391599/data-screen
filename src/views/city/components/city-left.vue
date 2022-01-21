<template>
    <div class="city-left-wrap">
        <Box class="box" title="新增病例路径">
            <div class="list">
                <div v-for="content in list" :key="content.id">
                    <div class="list-date">{{ content.title }}</div>
                    <div class="list-item" v-for="item in content.patients" :key="item.id">
                        <div class="item-name">
                            <div>{{ item.name }}</div>
                            <div><el-button size="mini" type="primary" @click="playback(content.id, item.id)">路径回放</el-button></div>
                        </div>
                        <div class="item-home">发现地点：{{ item.homeName }}</div>
                        <div class="item-line">
                            <div>路径:</div>
                            <div>
                                <div class="line" v-for="(subItem, subIndex) in item.routes" :key="subIndex">{{ subIndex + 1 }}、 {{ subItem.info }}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Box>
    </div>
</template>

<script>
import Box from '@/components/Box'
export default {
    props: ['list'],
    components: { Box },
    data() {
        return {}
    },
    computed: {},
    mounted() {},
    methods: {
        playback(contentId, id) {
            this.$emit('playback', contentId, id)
        }
    }
}
</script>

<style lang="scss" scoped>
.city-left-wrap {
    box-sizing: border-box;
    padding: 10px;
    .box {
        height: calc(100% - 20px);
        margin-bottom: 20px;
        .list {
            height: 100%;
            .list-date {
                font-size: 20px;
                margin: 10px 0;
            }
            .list-item {
                .item-name {
                    font-size: 18px;
                    color: red;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                }
                .item-home {
                    font-size: 18px;
                }
                .item-line {
                    display: flex;
                    > :first-child {
                        flex: none;
                        margin-right: 20px;
                    }
                    .line {
                        margin: 5px 0;
                    }
                }
            }
        }
    }
}
</style>
