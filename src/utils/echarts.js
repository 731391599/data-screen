import * as echarts from 'echarts'
import { parseTime } from './common'
export function drawLine(id, options) {
    const instance = echarts.getInstanceByDom(document.getElementById(id))
    const baseOptions = {
        grid: {
            left: '10%',
            top: '5%',
            right: '10%',
            bottom: '20%'
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                lineStyle: {
                    color: {
                        type: 'linear',
                        x: 0,
                        y: 0,
                        x2: 0,
                        y2: 1,
                        colorStops: [
                            {
                                offset: 0,
                                color: 'rgba(126,199,255,0)' // 0% 处的颜色
                            },
                            {
                                offset: 0.5,
                                color: 'rgba(126,199,255,1)' // 100% 处的颜色
                            },
                            {
                                offset: 1,
                                color: 'rgba(126,199,255,0)' // 100% 处的颜色
                            }
                        ],
                        global: false // 缺省为 false
                    }
                }
            }
        },
        xAxis: {
            type: 'category',
            axisLabel: {
                interval: 0,
                textStyle: {
                    color: '#7edae8'
                },
                formatter: function (data) {
                    return parseTime(data, '{m}-{d}')
                }
            },
            axisTick: {
                show: false
            },
            axisLine: {
                lineStyle: {
                    color: '#0087ED',
                    width: 1
                }
            },
            data: options.label
        },
        yAxis: [
            {
                type: 'value',
                position: 'left',
                splitLine: {
                    show: false
                },
                axisLine: {
                    lineStyle: {
                        color: '#0087ED',
                        width: 1
                    }
                },
                axisLabel: {
                    textStyle: {
                        color: '#7edae8'
                    }
                }
            },
            {
                type: 'value',
                position: 'right: ',
                splitLine: {
                    show: false
                },
                axisLine: {
                    lineStyle: {
                        color: '#0087ED',
                        width: 1
                    }
                },
                axisLabel: {
                    textStyle: {
                        color: '#7edae8'
                    }
                }
            }
        ],
        series: [
            {
                name: '确诊',
                type: 'line',
                smooth: true,
                data: options.series[1],
                yAxisIndex: 0,
                symbol: 'circle',
                showAllSymbol: true,
                symbolSize: 0,
                lineStyle: {
                    normal: {
                        width: 5,
                        color: 'rgba(25,163,223,1)' // 线条颜色
                    },
                    borderColor: 'rgba(0,0,0,.4)'
                },
                itemStyle: {
                    color: 'rgba(25,163,223,1)',
                    borderColor: '#646ace',
                    borderWidth: 2
                },
                tooltip: {
                    show: true
                },
                areaStyle: {
                    normal: {
                        color: new echarts.graphic.LinearGradient(
                            0,
                            0,
                            0,
                            1,
                            [
                                {
                                    offset: 0,
                                    color: 'rgba(25,163,223,.3)'
                                },
                                {
                                    offset: 1,
                                    color: 'rgba(25,163,223, 0)'
                                }
                            ],
                            false
                        ),
                        shadowColor: 'rgba(25,163,223, 0.5)', //阴影颜色
                        shadowBlur: 20 //shadowBlur设图形阴影的模糊大小。配合shadowColor,shadowOffsetX/Y, 设置图形的阴影效果。
                    }
                }
            },
            {
                name: '疑似',
                type: 'bar',
                data: options.series[2],
                yAxisIndex: 1,
                barWidth: '15%',
                itemStyle: {
                    normal: {
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                            {
                                offset: 0,
                                color: '#248ff7'
                            },
                            {
                                offset: 1,
                                color: '#6851f1'
                            }
                        ]),
                        barBorderRadius: 11
                    }
                }
            }
        ]
    }
    if (instance) {
        instance.setOption(baseOptions)
        return instance
    }
    const chart = echarts.init(document.getElementById(id))
    chart.setOption(baseOptions)
    return chart
}
