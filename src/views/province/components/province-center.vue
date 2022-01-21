<template>
    <div class="province-center-wrap">
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
import { mapGetters } from 'vuex'

export default {
    props: ['provinceId', 'center'],
    data() {
        return {
            scene: null,
            camera: null,
            renderer: null,
            map: null,
            projection: null,
            mouse: { x: 0, y: 0 },
            raycaster: null,
            pick: null,
            modelObject: {},
            animationFrame: null
        }
    },
    computed: {
        ...mapGetters(['provinceAreaTree'])
    },
    mounted() {
        console.log(this.provinceAreaTree[this.provinceId])
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
    beforeDestroy() {
        this.clearScene()
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
            this.initRender(container)
            this.initControls()
            this.initMap()
            this.initRaycaster()
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
            const projection = d3geo.geoMercator().center(this.center).scale(300).translate([0, 0])
            this.projection = projection
            this.provinceAreaTree[this.provinceId].forEach(elem => {
                const city = new THREE.Object3D()
                const coordinates = elem.geometry.coordinates
                coordinates.forEach(multiPolygon => {
                    multiPolygon.forEach(polygon => {
                        const shape = new THREE.Shape()
                        const lineMaterial = new THREE.LineBasicMaterial({ color: 0x2defff })
                        const lineGeometry = new THREE.Geometry()
                        for (let i = 0; i < polygon.length; i++) {
                            const [x, y] = projection(polygon[i])
                            if (i === 0) {
                                shape.moveTo(x, -y)
                            }
                            shape.lineTo(x, -y)
                            lineGeometry.vertices.push(new THREE.Vector3(x, -y, 1.01))
                        }
                        const extrudeSettings = {
                            depth: 1,
                            bevelEnabled: false
                        }
                        const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings)

                        const material = new THREE.MeshBasicMaterial({
                            color: '#2defff',
                            transparent: true,
                            opacity: 0.4
                        })
                        const material1 = new THREE.MeshBasicMaterial({
                            color: '#3480C4',
                            transparent: true,
                            opacity: 0.8
                        })
                        const mesh = new THREE.Mesh(geometry, [material, material1])
                        const line = new THREE.Line(lineGeometry, lineMaterial)

                        mesh.properties = elem.properties
                        city.add(mesh)
                        city.add(line)
                    })
                })
                city.properties = elem.properties
                if (city.properties.center) {
                    const [x, y] = projection(city.properties.center)
                    const number = city.properties.data?.today.confirm || 0
                    const group = this.createTag(city.properties.name, number)
                    group.position.set(x, -y, 3)
                    city.add(group)
                }
                this.map.add(city)
            })
            this.map.rotateX(-Math.PI / 2)
            this.scene.add(this.map)
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
        initRaycaster() {
            this.raycaster = new THREE.Raycaster()
            this.mouse = new THREE.Vector2()
            const onMouseMove = e => {
                this.mouse.x = (e.clientX / this.w) * 2 - 1
                this.mouse.y = -(e.clientY / this.h) * 2 + 1
            }
            const onClick = e => {
                this.mouse.x = (e.clientX / this.w) * 2 - 1
                this.mouse.y = -(e.clientY / this.h) * 2 + 1
                if (this.pick?.object?.properties?.name) {
                    this.$router.push({ path: '/city', query: { id: this.pick.object.properties.adcode, center: this.pick.object.properties.center } })
                }
            }
            const container = document.getElementById('container')
            container.addEventListener('mousemove', onMouseMove, false)
            container.addEventListener('click', onClick, false)
        },
        animate() {
            this.animationFrame = requestAnimationFrame(this.animate)
            this.renderer.render(this.scene, this.camera)
            this.raycaster.setFromCamera(this.mouse, this.camera)
            const intersects = this.raycaster.intersectObjects(this.map.children, true)
            if (this.pick) {
                this.pick.object.material[0].color.set('#2defff')
                this.pick.object.material[0].opacity = 0.4
                this.pick.object.material[1].color.set('#3480C4')
                this.pick.object.material[1].opacity = 0.8
                this.pick.object.scale.set(1, 1, 1)
            }
            this.pick = null
            this.pick = intersects.find(item => item.object.material && item.object.material.length === 2)
            if (this.pick) {
                this.pick.object.material[0].color.set('#ff7f00')
                this.pick.object.material[0].opacity = 0.88
                this.pick.object.material[1].color.set('#ff7f00')
                this.pick.object.material[1].opacity = 0.8
                this.pick.object.scale.set(1, 1, 2)
            }
            this.controls.update()
        },
        clearScene() {
            if (this.animationFrame) cancelAnimationFrame(this.animationFrame)
            this.scene.dispose()
            this.scene = null
            this.camera = null
            this.renderer = null
            this.map = null
            this.projection = null
            this.raycaster = null
        }
    }
}
</script>

<style lang="scss" scoped>
.province-center-wrap {
    display: flex;
    align-items: center;
    justify-content: center;
    #container {
        width: 100%;
        height: 100%;
        border: none;
    }
}
</style>
