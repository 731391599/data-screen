<template>
    <div class="app-top">
        <el-row class="row">
            <el-col :span="8" class="col"> <Time /> </el-col>
            <el-col :span="8" class="title">
                <div>国内疫情统计</div>
                <div>{{ updateTime }}</div>
            </el-col>
            <el-col :span="8" class="setting">
                <div>数据来源：网易</div>
                <i class="el-icon-full-screen" @click="full"></i>
            </el-col>
        </el-row>
    </div>
</template>

<script>
import Time from './time.vue'
import screenfull from 'screenfull'
import { mapGetters } from 'vuex'
export default {
    components: { Time },
    computed: {
        ...mapGetters(['updateTime'])
    },
    methods: {
        full() {
            screenfull.toggle()
        }
    }
}
</script>

<style lang="scss" scoped>
.app-top {
    height: 100%;
    padding: 0 20px;
    box-sizing: border-box;
    @include bg_img('~@/assets/img/top.png');
    .row {
        height: 100%;
        box-sizing: border-box;
        padding-top: 5px;
        .col {
            border: 1px solid transparent;
        }
        .title {
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-direction: column;
            > :first-child {
                font-size: 35px;
            }
            > :last-child {
                margin-left: 10px;
                font-size: 12px;
                color: #999999;
            }
        }
        .setting {
            display: flex;
            align-items: center;
            justify-content: flex-end;
            margin-top: 10px;
            > :first-child {
                margin-right: 20px;
                font-size: 14px;
                color: #f2f2f2;
            }
        }
    }
}
</style>
