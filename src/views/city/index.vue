<template>
    <div class="city">
        <template v-if="show">
            <CityCenter ref="center" :center="center" :list="list" :cityId="cityId" class="city-center" />
            <CityLeft :list="list" :cityId="cityId" class="city-left" @playback="playback" />
        </template>
    </div>
</template>

<script>
import CityCenter from './components/city-center.vue'
import CityLeft from './components/city-left.vue'
import { mapActions } from 'vuex'
export default {
    name: 'City',
    components: {
        CityCenter,
        CityLeft
    },
    data() {
        return {
            cityId: null,
            center: null,
            show: false,
            list: [
                {
                    id: 100001,
                    title: '12月15日新增3例新冠肺炎确诊病例',
                    patients: [
                        {
                            id: 0,
                            name: '确诊病例庄某峰',
                            home: [120.182522, 30.310686],
                            homeName: '拱墅区东新街道东新园茗盛苑',
                            routes: [
                                {
                                    date: '12月4日13时30分',
                                    line: [{ name: '东新园茗盛苑', center: [120.182522, 30.310686] }],
                                    info: '庄某(此前确诊病例)到茗盛苑家中，后一起晚饭。饭后20时庄某峰下楼扔垃圾，在小区内散步。'
                                },
                                {
                                    date: '12月5日17时',
                                    line: [
                                        { name: '东新园茗盛苑', center: [120.182522, 30.310686] },
                                        { name: '中大银泰城2楼', center: [120.174286, 30.326967] },
                                        { name: '东新园茗盛苑', center: [120.182522, 30.310686] }
                                    ],
                                    info: '与家人自驾前往中大银泰城2楼川味观吃火锅，20时回家后未外出。'
                                },
                                {
                                    date: '12月6日7时30分',
                                    line: [
                                        { name: '东新园茗盛苑', center: [120.182522, 30.310686] },
                                        { name: '观成武林中学', center: [120.167898, 30.319516] },
                                        { name: '东新园茗盛苑', center: [120.182522, 30.310686] },
                                        { name: '香积寺路长浜路口站', center: [120.183075, 30.310053] },
                                        { name: '三塘竹苑站', center: [120.172092, 30.307656] },
                                        { name: '中国工商银行香积寺路支行', center: [120.170437, 30.307614] },
                                        { name: '中国电信香积寺路营业厅', center: [120.164602, 30.306498] },
                                        { name: '三塘竹苑站', center: [120.172092, 30.307656] },
                                        { name: '香积寺路长浜路口站', center: [120.183075, 30.310053] },
                                        { name: '东新园茗盛苑', center: [120.182522, 30.310686] }
                                    ],
                                    info: '自驾车送孙子上学(观成武林中学)，后返回家中。10时乘坐72路公交车(从香积寺路长浜路口站至三塘竹苑站)，先前往中国工商银行香积寺路支行缴电费，后去中国电信香积寺路营业厅缴话费。12时15分乘坐72路公交车返回家中。'
                                },
                                {
                                    date: '12月7日7时30分',
                                    line: [
                                        { name: '东新园茗盛苑', center: [120.182522, 30.310686] },
                                        { name: '观成武林中学', center: [120.167898, 30.319516] },
                                        { name: '东新园茗盛苑', center: [120.182522, 30.310686] },
                                        { name: '观成武林中学', center: [120.167898, 30.319516] },
                                        { name: '东新园茗盛苑', center: [120.182522, 30.310686] }
                                    ],
                                    info: '自驾车送孙子上学后回家，15时自驾车接孙子放学回家，后集中隔离。'
                                }
                            ]
                        }
                    ]
                }
            ]
        }
    },
    created() {
        this.cityId = this.$route.query.id
        this.center = this.$route.query.center
        this.SET_CITY(this.cityId).then(() => {
            this.show = true
        })
    },
    methods: {
        ...mapActions(['SET_DATA', 'SET_PROVINCE', 'SET_CITY']),
        playback(contentId, id) {
            let route = this.list.find(item => item.id === contentId)?.patients.find(item => item.id === id)
            if (route) {
                this.$refs['center'].chooseModel(route)
            }
        }
    }
}
</script>

<style lang="scss" scoped>
.city {
    height: 100%;
    width: 100%;
    position: relative;
    overflow: hidden;
    .city-left {
        width: 25vw;
        height: 100%;
        position: absolute;
        left: 0;
        z-index: 2;
    }
    .city-center {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 1;
    }
    .city-right {
        width: 25vw;
        height: 100%;
        position: absolute;
        top: 0;
        right: 0;
        z-index: 2;
        background: red !important;
    }
}
</style>
