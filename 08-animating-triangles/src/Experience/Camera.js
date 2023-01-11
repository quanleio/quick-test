import * as THREE from "three"
import { gsap } from 'gsap'
import Experience from "./Experience.js"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js"
import {EVT} from '../../../04-noisy-stroke/src/utils/contains';

export default class Camera {
  constructor() {
    this.experience = new Experience()
    this.debug = this.experience.debug
    this.sizes = this.experience.sizes
    this.scene = this.experience.scene
    this.canvas = this.experience.canvas

    this.params = {
      cameraEndPoint: {
        x: 2,
        y: 2,
        z: 4,
      }
    }
    this.setInstance()
    this.setControls()
    this.transformCamera()
  }
  setInstance() {
    this.instance = new THREE.PerspectiveCamera(
      40,
      this.sizes.width / this.sizes.height,
      0.01,
      10000
    )
    // this.instance.position.set(2, 2, 2);
    this.instance.position.set(-20, 6, 20);
    this.scene.add(this.instance)
  }
  setControls() {
    this.controls = new OrbitControls(this.instance, this.canvas)
    this.controls.enabled = false
    this.controls.autoRotate = false
    this.controls.enableDamping = true
    this.controls.enableZoom = false
    this.controls.enablePan = false

    if (this.debug.active) {
      this.debugFolder = this.debug.ui.addFolder('Camera')
      const debugObject = {
        'Rotate': this.controls.autoRotate,
      };
      this.debugFolder.add(debugObject, "Rotate").onChange(val => {
        this.controls.autoRotate = val
      });
    }
  }
  transformCamera = () => {
    gsap.to(this.instance.position, {
      duration: 2.0,
      x: this.params.cameraEndPoint.x,
      y: this.params.cameraEndPoint.y,
      z: this.params.cameraEndPoint.z,
      ease: "power1.easeInOut",
      onUpdate: () => {
        this.instance.updateProjectionMatrix()
        // this.controls.target.copy(this.instance.position)
        // this.controls.update()
      },
      onComplete: () => {
        // this.controls.enabled = false

        // show first target group
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
