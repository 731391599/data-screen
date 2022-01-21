<template>
    <div class="city-center-wrap">
        <div id="container" />
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { initMap, initLine, initText } from '@/utils'
import { LineLayer } from '@antv/l7'
import { ThreeLayer, ThreeRender } from '@antv/l7-three'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { animate, easeInOut } from 'popmotion'
const S = 20
export default {
    props: ['cityId', 'center', 'list'],
    data() {
        return {
            scene: null,
            mapInstance: null,
            threeJSLayer: null,
            threeScene: null,
            layer: null,
            gltf: null,
            routes: [],
            pointsIndex: 0,
            isTravel: false,
            modelArray: [],
            s: 1.0,
            timer: null
        }
    },
    computed: {
        ...mapGetters(['cityAreaTree'])
    },
    mounted() {
        this.init()
    },
    beforeDestroy() {},
    methods: {
        init() {
            let mapObj = initMap(this.center, 'container')
            this.scene = mapObj.scene
            this.mapInstance = mapObj.mapInstance
            this.scene.on('loaded', () => {
                const lineLayer = initLine(this.cityAreaTree[this.cityId], '#00ffea')
                const textLayer = initText(this.cityAreaTree[this.cityId], '#00ffea')
                const layer = new LineLayer({}).source(this.cityAreaTree[this.cityId]).size(40).shape('wall').style({
                    opacity: 'testOpacity',
                    sourceColor: '#0DCCFF',
                    targetColor: 'rbga(255,255,255, 0)'
                })
                this.scene.addLayer(layer)
                this.scene.addLayer(lineLayer)
                this.scene.addLayer(textLayer)

                this.createThree()
                this.threeJSLayer.animate(true)
                this.scene.addLayer(this.threeJSLayer)

                this.createBuildings()
            })
        },
        createBuildings() {
            const buildings = Object.freeze(
                new AMap.Buildings({
                    zooms: [14, 18],
                    heightFactor: 1
                })
            )
            this.mapInstance.add(buildings)
        },
        createThree() {
            this.scene.registerRenderService(ThreeRender)
            this.threeJSLayer = new ThreeLayer({
                enableMultiPassRenderer: false,
                onAddMeshes: (threeScene, layer) => {
                    this.threeScene = threeScene
                    this.layer = layer
                    // 创建灯光
                    const { ambientLight, sunlight } = this.createLight()
                    this.threeScene.add(ambientLight)
                    this.threeScene.add(sunlight)
                    // const line = this.createLine(this.list[0].list[2].line)
                    // this.threeScene.add(line)
                    this.createModel()
                }
            })
        },
        createLight() {
            const sunlight = new THREE.DirectionalLight(0xffffff, 0.25)
            sunlight.position.set(0, 80000000, 100000000)
            sunlight.matrixWorldNeedsUpdate = true
            return {
                ambientLight: new THREE.AmbientLight(0xffffff),
                sunlight
            }
        },
        createLine(lineData) {
            const lineCoordData = lineData.map(d => {
                return this.layer.lnglatToCoord(d.center)
            })
            const rawPoints = []
            lineCoordData.map(d => {
                rawPoints.push(new THREE.Vector3(d[0], d[1], 0))
                return ''
            })
            const curve = new THREE.CatmullRomCurve3(rawPoints)
            const points = curve.getPoints(200)
            const geometry = new THREE.BufferGeometry().setFromPoints(points)
            this.routes = points
            const material = new THREE.LineBasicMaterial({ color: new THREE.Color('#FF0000') })
            const line = new THREE.LineLoop(geometry, material)
            return line
        },
        createModel() {
            return new Promise((resolve, reject) => {
                const loader = new GLTFLoader()
                loader.load('static/gltf/robot.glb', gltf => {
                    // const gltfScene = gltf.scene
                    // gltfScene.traverse(function (child) {
                    //     if (child.isMesh) {
                    //         child.material = new THREE.MeshLambertMaterial({
                    //             color: 0x22ffcc
                    //         })
                    //     }
                    // })
                    this.gltf = gltf
                    resolve()
                })
            })
        },
        chooseModel(route) {
            let routes = route.routes
                .map(item => item.line)
                .reduce((pre, cur) => {
                    return pre.concat(cur)
                }, [])
            const line = this.createLine(routes)
            this.threeScene.add(line)
            const marker = this.createMarker(route)
            this.selectModel(route.home)
            this.scene.setZoomAndCenter(16, route.home)
        },
        selectModel(center) {
            if (!this.gltf) {
                this.createModel().then(() => {
                    this.setModel(center)
                })
            } else {
                this.setModel(center)
            }
        },
        setModel(center) {
            const animations = this.gltf.animations
            if (animations && animations.length) {
                const mixer = new THREE.AnimationMixer(this.gltf.scene)
                const animation = animations.find(item => item.name === 'Running')
                const action = mixer.clipAction(animation)
                action.timeScale = 5
                action.play()
                this.layer.addAnimateMixer(mixer)
            }
            this.layer.adjustMeshToMap(this.gltf.scene)
            this.layer.setMeshScale(this.gltf.scene, 500, 500, 500)
            this.layer.setObjectLngLat(this.gltf.scene, center, 0)
            this.threeScene.add(this.gltf.scene)
            const self = this
            travelLoop()
            function travelLoop() {
                self.travel(self.gltf.scene, self.routes, 20000, () => {
                    travelLoop()
                })
            }
        },
        travel(mesh, path, duration, callback) {
            const self = this
            if (path.length < 2 || self.isTravel) return
            self.isTravel = true
            let startIndex = 0
            const len = path.length
            const currentP = path[0],
                nextP = path[1]
            const t = duration / len

            move(currentP, nextP)
            function move(currentP, nextP) {
                animate({
                    from: {
                        x: currentP.x,
                        y: currentP.y,
                        z: currentP.z
                    },
                    to: {
                        x: nextP.x,
                        y: nextP.y,
                        z: nextP.z
                    },
                    ease: easeInOut,
                    duration: t,
                    repeatType: 'loop',
                    onUpdate: o => {
                        mesh.position.set(o.x, o.y, o.z)
                    },
                    onComplete: () => {
                        startIndex++
                        if (startIndex < len - 1) {
                            const currentP = path[startIndex],
                                nextP = path[startIndex + 1]
                            mesh.lookAt(nextP)

                            move(currentP, nextP)
                        } else {
                            self.isTravel = false
                            callback && callback()
                        }
                    }
                })
            }
        },
        createMarker(route) {
            const group = new THREE.Group()
            const sprite = this.createTag(route.homeName, 2000)
            sprite.position.set(0, 0, 3000)
            group.add(sprite)
            const { mesh, waveMesh } = this.createMesh(300, 0x22ffcc, route.id)
            group.add(mesh)
            group.add(waveMesh)
            sprite.name = route.id
            group.name = route.id
            this.layer.setObjectLngLat(group, route.home, 1000)
            this.modelArray.push(group)
            this.threeScene.add(group)
            this.animate()
        },
        createMesh(size, color = 0x22ffcc, name = '') {
            const height = size * 4 //棱锥高度
            const geometry = new THREE.ConeGeometry(size, height, 4, 1, true)
            geometry.rotateX(-Math.PI / 2)
            geometry.translate(0, 0, height / 2)
            const material = new THREE.MeshLambertMaterial({
                map: new THREE.TextureLoader().load(require('@/assets/img/gradual.png')),
                color,
                transparent: true, //需要开启透明度计算，否则着色器透明度设置无效
                // opacity: 0.5,//整体改变透明度
                side: THREE.DoubleSide,
                depthTest: false
            })
            const mesh = new THREE.Mesh(geometry, material)
            mesh.name = name
            const mesh2 = mesh.clone()
            mesh2.scale.z = 0.5
            mesh2.position.z = height * (1 + mesh2.scale.z)
            mesh2.rotateX(Math.PI)
            mesh.add(mesh2)
            const waveMesh = this.createWaveMesh(size, color)
            waveMesh.position.z = height
            mesh.add(waveMesh)
            return {
                waveMesh,
                mesh
            }
        },
        createWaveMesh(size, color) {
            const geometry = new THREE.PlaneGeometry(size, size)
            const textureLoader = new THREE.TextureLoader()
            const material = new THREE.MeshBasicMaterial({
                color,
                map: textureLoader.load(require('@/assets/img/light-circle.png')),
                transparent: true,
                side: THREE.DoubleSide,
                depthTest: false
            })
            const mesh = new THREE.Mesh(geometry, material)
            return mesh
        },
        createTag(name) {
            const { spriteMaterial, p } = this.createCanvas(name)
            const sprite = new THREE.Sprite(spriteMaterial)
            sprite.scale.set(1000 * p, 1000, 1)
            return sprite
        },
        createCanvas(name) {
            const canvas = document.createElement('canvas')
            const c = canvas.getContext('2d')
            const font = 'bold 48px DigifaceWide'
            const padding = 30
            const h = 128
            c.font = font
            const w = c.measureText(name).width + 2 * padding
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
            c.fillText(name, 0, 0)
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
        animate() {
            this.timer && clearImmediate(this.timer)
            this.timer = setInterval(() => {
                // 中心点动画
                // 大门动画
                for (let i = 0; i < this.modelArray.length; i++) {
                    const group = this.modelArray[i]
                    const mesh = group.children[1]
                    const meshWave = group.children[2]
                    mesh.rotateZ(0.05)
                    this.s += 0.2
                    meshWave.scale.set(this.s, this.s, this.s)
                    if (this.s <= S * 0.2) {
                        meshWave.material.opacity = (this.s - 1) / (S * 0.2 - 1) //保证透明度在0~1之间变化
                    } else if (this.s > S * 0.2 && this.s <= S) {
                        meshWave.material.opacity = 1 - (this.s - S * 0.2) / (S - S * 0.2) //保证透明度在0~1之间变化
                    } else {
                        this.s = 1.0
                    }
                }
            }, 16)
        }
    }
}
</script>

<style lang="scss" scoped>
.city-center-wrap {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    width: 100%;
    padding: 0;
    #container {
        position: fixed;
        width: 100vw;
        height: 100vh;
        top: 0;
        left: 0;
        border: none;
    }
}
</style>
