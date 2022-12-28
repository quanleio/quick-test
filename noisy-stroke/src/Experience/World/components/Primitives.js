import * as THREE from 'three'
import { gsap } from 'gsap'
import Experience from '../../Experience'

export default class Primitives {
  constructor(_material) {
    this.experience = new Experience()
    this.scene = this.experience.scene
    this.clock = new THREE.Clock()
    this.noiseMaterial = _material.clone()

    this.isCompleted = false

    this.setObjects()

    this.animate()
    // window.addEventListener(EVT.CAMERA_ANIMATE_COMPLETED, () => {
    //   this.animate()
    // })
  }
  setObjects = () => {
    const geometry = new THREE.SphereGeometry(2, 64, 64)

    // sphere
    this.sphere = new THREE.Mesh(geometry, this.noiseMaterial)
    this.sphere.position.set(0, -50, 0)
    this.scene.add(this.sphere)

    // for test
    // const cube = new THREE.Mesh(geometry, new THREE.MeshStandardMaterial())
    // cube.position.x = 5
    // this.scene.add(cube)
  }
  animate = () => {
    const tl = gsap.timeline()
    tl.to(this.sphere.position, {
      duration: 2.,
      y: 0,
      ease: "back.inOut(0.7)",
      onComplete: () => {
        this.isCompleted = true
        // this.sphere.material.uniforms.uProgress.value = 0.5
        // this.noiseMaterial.uniforms.needsUpdate = true
      }
    })
    /*tl.to(this.sphere.position, {
      duration: 2.,
      y: -50,
      ease: "back.inOut(0.7)",
    })*/
  }
  update = () => {
    this.noiseMaterial.uniforms.uTime.value = performance.now() / 1500

    if (this.isCompleted) {
      let val = this.sphere.material.uniforms.uProgress.value

      if (val >= 0 && val < 1.0) {
        this.sphere.material.uniforms.uProgress.value = this.clock.getElapsedTime() * 0.2
      }
    }
  }
}
