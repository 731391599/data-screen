<template>
    <div class="time-wrap">
        <div class="time-wrap-left">{{ time }}</div>
        <div class="time-wrap-right">
            <div>{{ date }}</div>
            <div>{{ week }}</div>
        </div>
    </div>
</template>

<script>
import { parseTime } from '@/utils'
export default {
    data() {
        return {
            timer: null,
            time: null,
            date: null,
            week: null
        }
    },
    mounted() {
        this.updateTime()
    },
    methods: {
        beforeDestroy() {
            this.clearTimer()
        },
        updateTime() {
            this.clearTimer()
            this.timer = setInterval(() => {
                let time = new Date()
                this.time = parseTime(time, '{h}:{i}:{s}')
                this.date = parseTime(time, '{y}-{m}-{d}')
                this.week = '星期' + parseTime(time, '{a}')
            }, 1000)
        },
        clearTimer() {
            if (this.timer) {
                clearInterval(this.timer)
            }
        }
    }
}
</script>

<style lang="scss" scped>
@import '~@/assets/font/DigifaceWide.css';
.time-wrap {
    display: flex;
    align-items: center;
    font-family: DigifaceWide;
    .time-wrap-left {
        font-size: 24px;
        font-weight: bold;
    }
    .time-wrap-right {
        font-size: 15px;
        margin-left: 20px;
    }
}
</style>
