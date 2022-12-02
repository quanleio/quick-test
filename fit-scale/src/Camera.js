import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import Experience from './Experience';

export default class Camera {
  constructor() {
    this.experience = new Experience()
    this.width = this.experience.width
    this.height = this.experience.height
    this.pixelRatio = this.experience.pixelRatio

    this.scene = this.experience.scene
    this.canvas = this.experience.canvas

    this.setInstance()
    this.setControls()
  }
  setInstance() {
    this.instance = new THREE.PerspectiveCamera(
        45,
        this.width / this.height,
        .01,
        10000
    )
    this.instance.position.set(0, 0, 10)
    // this.instance.lookAt(0, 0, 0)
    this.scene.add(this.instance)

    // const helper = new THREE.CameraHelper( this.instance );
    // this.scene.add( helper );
  }
  setControls() {
    this.controls = new OrbitControls(this.instance, this.canvas)
    this.controls.enabled = true
    // this.controls.enableZoom = false
  }
  resize() {
    this.instance.aspect = this.width / this.height
    this.instance.updateProjectionMatrix()
  }
  update() {
    this.controls.update()
  }
}
