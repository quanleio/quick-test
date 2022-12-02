import * as THREE from 'three'
import Environment from './Environment'
import Camera from './Camera'
import Renderer from './Renderer'
import World from './World';

export default class Experience {
  static instance

  constructor(_canvas) {
    if (Experience.instance) {
      return Experience.instance
    }
    Experience.instance = this

    this.canvas = _canvas
    this.scene = new THREE.Scene()
    this.width = window.innerWidth
    this.height = window.innerHeight
    this.pixelRatio = Math.min(window.devicePixelRatio, 2)

    this.environment = new Environment()
    this.camera = new Camera()
    this.renderer = new Renderer()
    this.world = new World()

    this.tick()
  }
  resize = () => {
    this.camera.resize()
    this.renderer.resize()
  }
  tick = () => {
    // console.log('tick')
    this.camera.update()
    this.world.update()
    this.renderer.update()

    requestAnimationFrame(this.tick)
  }
}
