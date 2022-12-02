import * as THREE from "three"
import { gsap, Power1} from 'gsap/gsap-core';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import Experience from "./Experience.js"

export default class Camera {
  constructor() {
    this.experience = new Experience()
    this.sizes = this.experience.sizes
    this.scene = this.experience.scene
    this.canvas = this.experience.canvas

    this.setInstance()
    this.setControls()
    this.transform()
  }
  setInstance() {
    this.instance = new THREE.PerspectiveCamera(
      45,
      this.sizes.width / this.sizes.height,
      .01,
      1000
    )
    this.instance.position.set(0, 0, 30)
    // this.instance.rotation.set(0, 0, 0)
    // this.instance.lookAt(0, 0, 0)
    this.scene.add(this.instance)
  }
  setControls() {
    this.controls = new OrbitControls(this.instance, this.canvas)
    this.controls.enabled = false
  }
  resize() {
    this.instance.aspect = this.sizes.width / this.sizes.height
    this.instance.updateProjectionMatrix()
  }
  transform() {
    gsap.to( this.instance.position, {
      duration: 1.6,
      y: 11,
      z: 9,
      ease: Power1.easeInOut,
      onUpdate: () => {
        // this.instance.updateProjectionMatrix()
        // this.controls.update()
      },
      onComplete: () => {
        this.controls.enabled = true
        this.instance.lookAt(0, 0, 0)
      }
    })
    /*gsap.to( this.instance.rotation, {
      duration: 2,
      x: 0,
      ease: Power1.easeInOut,
      onUpdate: () => {},
      onComplete: () => {
        // this.controls.enabled = true
      }
    })*/
  }
  update() {
    this.controls.update()
  }
}
