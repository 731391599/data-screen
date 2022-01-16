<template>
    <div class="home-right-wrap">
        <Box class="box list" title="国内今日新增">
            <div id="add">
                <div class="head">
                    <div>省份</div>
                    <div>新增</div>
                    <div>现有</div>
                    <div>确诊</div>
                    <div>死亡</div>
                    <div>治愈</div>
                </div>
                <div class="list">
                    <div
                        class="item"
                        :class="{
                            'animate-up': animateUp && index === 0,
                            'animate-list': animateUp && index !== 0,
                            bg: item.bg === 0
                        }"
                        v-for="(item, index) in list"
                        :key="index"
                    >
                        <div>{{ item.name }}</div>
                        <div style="color: red">{{ item.todayConfirm }}</div>
                        <div>{{ item.now }}</div>
                        <div>{{ item.totalConfirm }}</div>
                        <div>{{ item.dead }}</div>
                        <div style="color: green">{{ item.heal }}</div>
                    </div>
                </div>
            </div>
        </Box>
    </div>
</template>

<script>
import Box from '@/components/Box'
import { mapGetters } from 'vuex'
export default {
    components: { Box },
    computed: {
        ...mapGetters(['areaTree'])
    },
    data() {
        return {
            scrollTimer: null,
            animateUp: false,
            list: []
        }
    },
    mounted() {
        this.init()
    },
    beforeDestroy() {
        this.stopScrollList()
    },
    methods: {
        init() {
            this.getLiftBrandCountData()
        },
        // 右下滚动列表
        getLiftBrandCountData() {
            this.list = this.areaTree
                .filter(item => item.properties.name)
                .map((item, index) => {
                    let bg = 0
                    if (index % 2 === 0) bg = 1
                    const properties = item.properties
                    const today = properties.data?.today
                    const total = properties.data?.total
                    return {
                        name: this.filterName(properties.name), // 省份
                        todayConfirm: today?.confirm || 0, // 今日新增
                        totalConfirm: total?.confirm || 0, // 累计确诊
                        now: total?.confirm - total?.heal - total?.dead || 0, // 现有确诊
                        dead: total?.dead || 0, // 死亡
                        heal: total?.heal || 0, // 治愈
                        bg
                    }
                })
            this.scrollList()
        },
        filterName(name) {
            if (name.search('省') != -1) {
                return name.replace('省', '')
            } else if (name.search('市') != -1) {
                return name.replace('市', '')
            } else {
                return name.substr(0, 2)
            }
        },
        // 列表滚动开始
        scrollList() {
            this.stopScrollList()
            this.scrollTimer = setInterval(() => {
                this.animateUp = true
                setTimeout(() => {
                    this.list.push(this.list[0])
                    this.list.shift()
                    this.animateUp = false
                }, 1000)
            }, 2000)
        },
        // 列表滚动结束
        stopScrollList() {
            if (this.scrollTimer) clearInterval(this.scrollTimer)
        },
        // 列表进出动画
        enter() {
            this.stopScrollList()
        },
        leave() {
            this.scrollList()
        }
    }
}
</script>

<style lang="scss" scoped>
.home-right-wrap {
    box-sizing: border-box;
    padding: 10px;
    font-family: DigifaceWide;
    .box {
        margin-bottom: 20px;
        &:last-child {
            margin-bottom: 0;
        }
    }
    .list {
        height: calc(100% - 20);
    }
}

#add {
    height: 100%;
    width: 100%;
    padding: 10px 20px;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    color: #fff;
    .head {
        display: flex;
        justify-content: space-between;
        height: 40px;
        flex: none;
        > div {
            display: flex;
            align-items: center;
            justify-content: center;
            height: 100%;
            width: calc(100% / 6);
            &:first-child {
                border-right: 1px solid #555;
            }
        }
    }
    .list {
        flex: 1;
        overflow-y: auto;
        overflow-x: hidden;
        scrollbar-width: none; /* firefox */
        -ms-overflow-style: none; /* IE 10+ */
        &::-webkit-scrollbar {
            display: none; /* Chrome Safari */
        }
        .item {
            height: 40px;
            display: flex;
            margin: 10px 0;
            > div {
                display: flex;
                align-items: center;
                justify-content: center;
                height: 100%;
                width: calc(100% / 6);
                flex: 1;
                box-sizing: border-box;
                &:first-child {
                    border-right: 1px solid #555;
                    // text-overflow: ellipsis;
                    // overflow: hidden;
                    // white-space: nowrap;
                }
            }
        }
        .bg {
            background: #001d33;
        }
    }
}

.animate-up {
    opacity: 0;
    transition: all 2s;
    transform: translateX(-200px);
}
.animate-list {
    transition: all 1s;
    transform: translateY(-50px);
}
</style>
