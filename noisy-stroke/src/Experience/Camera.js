import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js"
import Experience from "./Experience.js"
import { gsap } from 'gsap'
import {EVT} from '../../../grain-effect/src/utils/contains';

export default class Camera {
  constructor() {
    this.experience = new Experience()
    this.debug = this.experience.debug
    this.sizes = this.experience.sizes
    this.scene = this.experience.scene
    this.canvas = this.experience.canvas

    this.setInstance()
    this.setControls()
    this.transform()
  }
  setInstance() {
    this.instance = new THREE.PerspectiveCamera(
      75,
      this.sizes.width / this.sizes.height,
      0.01,
      10000
    )
    this.instance.position.set(0, 2, 7);
    // this.instance.position.set(20, 10, 30);
    this.scene.add(this.instance)
  }
  setControls() {
    this.controls = new OrbitControls(this.instance, this.canvas)
    this.controls.enabled = false
    this.controls.autoRotate = false

    /*if (this.debug.active) {
      this.debugFolder = this.debug.ui.addFolder('Camera')
      const debugObject = {
        'Rotate': this.controls.autoRotate,
      };
      this.debugFolder.add(debugObject, "Rotate").onChange(val => {
        this.controls.autoRotate = val
      });
    }*/
  }
  transform() {
    gsap.to( this.instance.position, {
      duration: 1.6,
      x: 0,
      y: 2,
      z: 7,
      ease: "power1.easeInOut",
      onUpdate: () => {
        // this.instance.updateProjectionMatrix()
        // this.controls.update()
      },
      onComplete: () => {
        this.controls.enabled = true
        this.instance.lookAt(0, 0, 0)
        window.dispatchEvent(new Event(EVT.CAMERA_ANIMATE_COMPLETED))
      }
    })
  }
  resize() {
    this.instance.aspect = this.sizes.width / this.sizes.height
    this.instance.updateProjectionMatrix()
  }
  update() {
    this.controls.update()
  }
}
