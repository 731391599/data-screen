import { deepClone, merge } from './common'
import { Scene, LineLayer, PointLayer } from '@antv/l7'
import { GaodeMap } from '@antv/l7-maps'

export function initMap(center, id, others) {
    const source = {
        resizeEnable: true, // 是否监控地图容器尺寸变化
        viewMode: '3D',
        pitch: 50,
        rotation: -35,
        mapStyle: 'amap://styles/effd80d7df65e5fe9e937be74f6d0262',
        // zoom: 14.8,
        center,
        features: ['bg', 'road', 'point', 'building'],
        plugin: ['AMap.MouseTool', 'AMap.PlaceSearch', 'AMap.Autocomplete"']
    }
    const options = merge(source, others)
    const map = new AMap.Map(id, options)
    return {
        scene: new Scene({
            id,
            map: new GaodeMap({
                mapInstance: map
            }),
            logoVisible: false
        }),
        mapInstance: map
    }
}

export function initLine(data, color) {
    return new LineLayer({ zIndex: 99 }).source(data).size(1).shape('line').color(color).animate({
        interval: 1, // 间隔
        duration: 1, // 持续时间，延时
        trailLength: 1 // 流线长度
    })
}

// 地图区域标识, minZoom: 11.5, maxZoom: 19
export function initText(data, color, opt = { zIndex: 99 }) {
    return new PointLayer(opt)
        .source(data)
        .shape('name', 'text')
        .size(20)
        .color(color)
        .style({
            textAnchor: 'center', // 文本相对锚点的位置 center|left|right|top|bottom|top-left
            textOffset: [0, 0], // 文本相对锚点的偏移量 [水平, 垂直]
            spacing: 2, // 字符间距
            padding: [1, 1], // 文本包围盒 padding [水平，垂直]，影响碰撞检测结果，避免相邻文本靠的太近
            stroke: '#ffffff', // 描边颜色
            strokeWidth: 0.3, // 描边宽度
            strokeOpacity: 1.0
        })
}
