import * as THREE from 'three'
import Experience from '../../Experience'

export default class ModelSet {
  constructor(_material) {
    this.experience = new Experience()
    this.scene = this.experience.scene
    this.resources = this.experience.resources
    this.noiseMaterial = _material.clone()
    this.clock = new THREE.Clock()

    this.addModels()
  }
  addModels = () => {
    // fox
    const fox = this.resources.items.foxModel.scene
    fox.scale.setScalar(1/45)
    fox.position.set(0, -.7, 0)
    fox.rotation.y = Math.PI/180 * -30
    fox.traverse(child => {
      if (child.material) {
        child.material = this.noiseMaterial
      }
    })
    // this.scene.add(fox)

    // face
    this.face = this.resources.items.oldFace.scene
    this.face.scale.setScalar(3)
    this.face.position.set(0, 0.5, 0)
    this.face.receiveShadow = this.face.castShadow = true

    this.face.traverse(child => {
      if (child.material) {
        child.material = this.noiseMaterial
      }
      if(child.geometry) {
        child.geometry.center()
      }
    })
    // this.scene.add(this.face)
  }
  update = () => {
    /*let val = this.noiseMaterial.uniforms.uProgress.value

    if (val >= 0 && val < 1.0) {
      this.noiseMaterial.uniforms.uProgress.value = this.clock.getElapsedTime() * 0.2
    }*/
  }
}
