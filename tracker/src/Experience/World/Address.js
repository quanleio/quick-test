import * as THREE from 'three'
import Experience from '../Experience';

export default class Address {
  constructor() {
    this.experience = new Experience()
    this.scene = this.experience.scene
    this.resources = this.experience.resources
    this.time = this.experience.time

    this.resource = this.resources.items.address

    this.setMaterial()
    this.setModel()
  }
  setMaterial() {
    this.material = new THREE.SpriteMaterial({
      map: this.resource,
      side: THREE.DoubleSide,
      blending: THREE.NormalBlending,
      sizeAttenuation: true,
      opacity: 1,
      transparent: true,
      depthTest: true,
      depthWrite: true,
    })
  }
  setModel() {
    this.mapAddress = new THREE.Sprite(this.material)
    this.mapAddress.scale.setScalar(10)
    this.scene.add(this.mapAddress)
  }
  update() {}
}
