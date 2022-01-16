<template>
    <div class="home-center-wrap">
        <div id="container" />
    </div>
</template>

<script>
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import * as d3geo from 'd3-geo'
import { Line2 } from 'three/examples/jsm/lines/Line2'
import { LineGeometry } from 'three/examples/jsm/lines/LineGeometry'
import { LineMaterial } from 'three/examples/jsm/lines/LineMaterial'
import * as TWEEN from 'tween.js'
import { mapGetters } from 'vuex'

export default {
    data() {
        return {
            scene: null,
            camera: null,
            renderer: null,
            map: null,
            projection: null,
            center: [107.670379, 33.70435]
        }
    },
    computed: {
        ...mapGetters(['areaTree'])
    },
    mounted() {
        this.init()
        window.onresize = () => {
            const container = document.getElementById('container')
            this.w = container.clientWidth
            this.h = container.clientHeight
            this.renderer.setSize(this.w, this.h)
            this.camera.aspect = this.w / this.h
            this.camera.updateProjectionMatrix()
        }
    },
    methods: {
        init() {
            const container = document.getElementById('container')
            this.w = container.clientWidth
            this.h = container.clientHeight
            this.r = window.devicePixelRatio
            this.initScene()
            this.initCamera()
            this.initLight()
            // this.initGrid()
            this.initRender(container)
            this.initControls()
            this.initMap()
            this.animate()
        },
        initScene() {
            this.scene = new THREE.Scene()
        },
        initCamera() {
            this.camera = new THREE.PerspectiveCamera(30, this.w / this.h, 1, 3000)
            this.camera.position.set(0, 50, 70) //相机在Three.js三维坐标系中的位置
            this.camera.lookAt(0, 0, 0) //相机指向Three.js坐标系原点
        },
        initLight() {
            let light = new THREE.AmbientLight(0xffffff, 0.6)
            this.scene.add(light)
        },
        // 初始化网格
        initGrid() {
            let helpers = new THREE.Group()
            helpers.add(new THREE.AxesHelper(200))
            this.scene.add(helpers)
            let gh = new THREE.GridHelper(400, 400, new THREE.Color(0x555555), new THREE.Color(0x333333))
            this.scene.add(gh)
        },
        initRender(container) {
            this.renderer = new THREE.WebGLRenderer({
                antialias: true,
                alpha: true
            })
            this.renderer.setPixelRatio(this.r)
            this.renderer.setSize(this.w, this.h)
            container.appendChild(this.renderer.domElement)
        },
        initControls() {
            this.controls = new OrbitControls(this.camera, this.renderer.domElement)
            this.controls.enableDamping = true
            this.controls.damingFactor = 0.25
            this.controls.screenSpacePanning = false
            this.controls.maxDistance = 800
            this.controls.update()
        },
        initMap() {
            this.map = new THREE.Object3D()
            const projection = d3geo.geoMercator().center(this.center).scale(80).translate([0, 0])
            this.projection = projection
            console.log(this.areaTree)
            this.areaTree.forEach(elem => {
                const province = new THREE.Object3D()
                const coordinates = elem.geometry.coordinates[0]
                coordinates.forEach(polygon => {
                    const shape = new THREE.Shape()
                    const lineMaterial = new THREE.LineBasicMaterial({ color: 0x2defff })
                    const linGeometry = new THREE.Geometry()
                    for (let i = 0; i < polygon.length; i++) {
                        const [x, y] = projection(polygon[i])
                        if (i === 0) {
                            shape.moveTo(x, -y)
                        }
                        shape.lineTo(x, -y)
                        linGeometry.vertices.push(new THREE.Vector3(x, -y, 1.01))
                    }
                    const extrudeSettings = {
                        depth: 1,
                        bevelEnabled: false
                    }
                    const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings)
                    const material = new THREE.MeshBasicMaterial({ color: '#3480C4', transparent: true, opacity: 0.8 })
                    const mesh = new THREE.Mesh(geometry, material)
                    const line = new THREE.Line(linGeometry, lineMaterial)
                    province.add(mesh)
                    province.add(line)
                })
                province.properties = elem.properties
                if (province.properties.center) {
                    const [x, y] = projection(province.properties.center)
                    const number = province.properties.data?.today.confirm || 0
                    const group = this.createTag(province.properties.name, number)
                    group.position.set(x, -y, 3)
                    province.add(group)
                }
                this.map.add(province)
            })
            this.map.rotateX(-Math.PI / 2)
            this.scene.add(this.map)
            this.selectAnimate()
        },
        createTag(name, number) {
            const group = new THREE.Group()
            const { spriteMaterial, p } = this.createCanvas(name, number)
            const sprite = new THREE.Sprite(spriteMaterial)
            sprite.scale.set(2 * p, 2, 1)
            group.add(sprite)
            var material = new LineMaterial({ color: 0x00ffff, linewidth: 2 })
            var geometry = new LineGeometry()
            material.resolution.set(window.innerWidth, window.innerHeight)
            var pointArr = [0, 0, 0, 0, 0, -2]
            geometry.setPositions(pointArr)
            var line = new Line2(geometry, material)
            group.add(line)
            return group
        },
        // 自适应
        createCanvas(name, number) {
            const canvas = document.createElement('canvas')
            const c = canvas.getContext('2d')
            const font = 'bold 48px DigifaceWide'
            const padding = 30
            const h = 128
            c.font = font
            const w = c.measureText(name).width + c.measureText(' ' + number).width + 2 * padding
            canvas.height = h
            canvas.width = w
            // 比例
            const p = w / h
            c.fillStyle = 'rgba(0,0,0,0.6)'
            c.fillRect(0, 0, w, h)
            c.beginPath()
            c.translate(padding, h / 2)
            c.font = font
            c.textBaseline = 'middle'
            c.fillStyle = '#00ffff'
            c.fillText(name + ' ' + number, 0, 0)
            const texture = new THREE.CanvasTexture(canvas)
            return {
                spriteMaterial: new THREE.SpriteMaterial({
                    map: texture,
                    transparent: true,
                    side: THREE.DoubleSide
                }),
                p
            }
        },
        selectAnimate() {
            if (!this.map) return
            const l = this.map.children.filter(item => item.properties.name).length
            const tweenArray = []
            for (let i = 0; i < l; i++) {
                const pos = { s: 1 }
                const tween1 = new TWEEN.Tween(pos)
                    .to({ s: 2 }, 2000)
                    .onStart(() => {
                        this.map.children[i].children[0].material.color.set('#ff7f00')
                        this.map.children[i].children[1].material.color.set('#FFFFFF')
                    })
                    .onUpdate(() => {
                        this.map.children[i].scale.set(1, 1, pos.s)
                    })
                    .onComplete(() => {
                        tween2.start()
                    })
                const tween2 = new TWEEN.Tween(pos)
                    .to({ s: 1 }, 1000)
                    .onUpdate(() => {
                        this.map.children[i].scale.set(1, 1, pos.s)
                    })
                    .onComplete(() => {
                        this.map.children[i].children[0].material.color.set('#3480C4')
                        this.map.children[i].children[1].material.color.set('#2defff')
                    })
                tweenArray.push(tween1)
            }
            tweenArray.forEach((item, index) => {
                if (index === tweenArray.length - 1) {
                    item.chain(tweenArray[0])
                } else {
                    item.chain(tweenArray[index + 1])
                }
            })
            tweenArray[0].start()
        },
        animate() {
            TWEEN.update()
            requestAnimationFrame(this.animate)
            this.renderer.render(this.scene, this.camera)
            this.controls.update()
        }
    }
}
</script>

<style lang="scss" scoped>
.home-center-wrap {
    display: flex;
    align-items: center;
    justify-content: center;
    #container {
        width: 100%;
        height: 100%;
    }
}
</style>
