import * as THREE from 'three'
import Experience from './Experience';

export default class Renderer {
  constructor() {
    this.experience = new Experience()
    this.canvas = this.experience.canvas
    this.width = this.experience.width
    this.height = this.experience.height
    this.pixelRatio = this.experience.pixelRatio
    this.scene = this.experience.scene
    this.camera = this.experience.camera

    this.setInstance()
  }
  setInstance() {
    this.instance = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
    })

    this.instance.setClearColor("#262626", 1)
    // this.instance.physicallyCorrectLights = true
    // this.instance.outputEncoding = THREE.sRGBEncoding
    this.instance.toneMapping = THREE.LinearToneMapping
    this.instance.toneMappingExposure = 1

    this.resize()
  }
  resize() {
    this.instance.setSize(this.width, this.height)
    this.instance.setPixelRatio(Math.min(this.pixelRatio, 2))
  }
  update() {
    this.instance.render(this.scene, this.camera.instance)
  }
}
