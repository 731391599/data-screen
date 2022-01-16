<template>
    <div class="home-left-wrap">
        <Box class="box" title="国内累计确诊">
            <div class="count-total">
                <img class="img" src="@/assets/img/count-back.png" alt="" />
                <CountTo class="count-number" :duration="3000" :endVal="chinaTotal.total.confirm" />
            </div>
        </Box>
        <Box class="box" title="国内疫情数据">
            <div class="form">
                <div class="form-card">
                    <div>境外输入</div>
                    <CountTo :duration="3000" :endVal="chinaTotal.total.input" />
                    <div>较昨日+ <CountTo :duration="3000" :endVal="chinaTotal.today.input" /></div>
                </div>
                <div class="form-card">
                    <div>无症状感染者</div>
                    <CountTo :duration="3000" :endVal="chinaTotal.extData.noSymptom" />
                    <div>较昨日+ <CountTo :duration="3000" :endVal="chinaTotal.extData.incrNoSymptom" /></div>
                </div>
                <div class="form-card">
                    <div>现有确诊</div>
                    <CountTo :duration="3000" :endVal="storeConfirm" />
                    <div>较昨日+ <CountTo :duration="3000" :endVal="chinaTotal.today.storeConfirm" /></div>
                </div>
                <div class="form-card">
                    <div>累计确诊</div>
                    <CountTo :duration="3000" :endVal="chinaTotal.total.confirm" />
                    <div>较昨日+ <CountTo :duration="3000" :endVal="chinaTotal.today.confirm" /></div>
                </div>
                <div class="form-card">
                    <div>累计死亡</div>
                    <CountTo :duration="3000" :endVal="chinaTotal.total.dead" />
                    <div>较昨日+ <CountTo :duration="3000" :endVal="chinaTotal.today.dead" /></div>
                </div>
                <div class="form-card">
                    <div>累计治愈</div>
                    <CountTo :duration="3000" :endVal="chinaTotal.total.heal" />
                    <div>较昨日+ <CountTo :duration="3000" :endVal="chinaTotal.today.heal" /></div>
                </div>
            </div>
        </Box>
        <Box class="box" title="疫情趋势">
            <div id="line"></div>
        </Box>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Box from '@/components/Box'
import { drawLine } from '@/utils'
export default {
    components: { Box },
    data() {
        return {
            lineCharts: null,
            chartsData: {
                label: [],
                series: {
                    1: [],
                    2: []
                }
            },
            countTimer: null
        }
    },
    computed: {
        ...mapGetters(['chinaTotal', 'chinaDayList']),
        storeConfirm() {
            return this.chinaTotal.total.confirm - this.chinaTotal.total.dead - this.chinaTotal.total.heal
        }
    },
    mounted() {
        this.init()
        window.onresize = () => {
            this.$nextTick(() => {
                this.lineCharts.resize()
            })
        }
    },
    beforeDestroy() {
        this.countTimer && clearInterval(this.countTimer)
    },
    methods: {
        init() {
            this.chinaDayList.forEach(item => {
                this.chartsData.label.push(item.date)
                this.chartsData.series[1].push(item.today.confirm)
                this.chartsData.series[2].push(item.today.suspect)
            })
            const length = this.chinaDayList.length
            const endLabel = this.chartsData.label.splice(5, length)
            const endList1 = this.chartsData.series[1].splice(5, length)
            const endList2 = this.chartsData.series[2].splice(5, length)
            let _self = this
            this.countTimer && clearInterval(this.countTimer)

            this.countTimer = setInterval(
                (function countAnimate() {
                    let labelTemp1 = _self.chartsData.label.shift()
                    endLabel.push(labelTemp1)

                    let labelTemp2 = endLabel.shift()
                    _self.chartsData.label.push(labelTemp2)

                    let series1Temp1 = _self.chartsData.series[1].shift()
                    endList1.push(series1Temp1)

                    let series1Temp2 = endList1.shift()
                    _self.chartsData.series[1].push(series1Temp2)

                    let series2Temp1 = _self.chartsData.series[2].shift()
                    endList2.push(series2Temp1)

                    let series2Temp2 = endList2.shift()
                    _self.chartsData.series[2].push(series2Temp2)

                    _self.lineCharts = drawLine('line', {
                        label: _self.chartsData.label,
                        series: _self.chartsData.series
                    })
                    return countAnimate
                })(),
                2000
            )
        }
    }
}
</script>

<style lang="scss" scoped>
.home-left-wrap {
    box-sizing: border-box;
    padding: 10px;
    .box {
        height: calc((100% - 40px) / 3);
        margin-bottom: 20px;
        &:last-child {
            margin-bottom: 0;
        }
        .count-total {
            height: 100%;
            width: 100%;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            position: relative;
            font-family: DigifaceWide;

            .img {
                position: absolute;
                height: 60%;
                width: 100%;
                top: 40%;
            }
            div {
                position: absolute;
            }
            .count-number {
                color: #fff;
                position: absolute;
                top: 10%;
                font-size: 80px;
            }
        }
        .form {
            height: 100%;
            display: flex;
            flex-wrap: wrap;
            .form-card {
                height: calc(50% - 40px);
                width: calc((100% - 60px) / 3);
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                box-sizing: border-box;
                margin: 10px;
                > :first-child {
                    font-size: 20px;
                }
                > :nth-child(2) {
                    font-size: 24px;
                    margin: 5px 0;
                    color: #00ffea;
                }
                > :last-child {
                    font-size: 16px;
                }
            }
        }
        #line {
            height: 100%;
            width: 100%;
        }
    }
}
</style>
