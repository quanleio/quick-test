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
    /*this.material = new THREE.SpriteMaterial({
      map: this.resource,
      side: THREE.DoubleSide,
      blending: THREE.NormalBlending,
      sizeAttenuation: true,
      opacity: 1,
      transparent: true,
      depthTest: true,
      depthWrite: true,
    })*/
    this.material = new THREE.MeshStandardMaterial({
      map: this.resource,
      side: THREE.DoubleSide,
      transparent: true,
    })
  }
  setModel() {
    this.mapAddress = new THREE.Mesh( new THREE.PlaneGeometry(1, 1), this.material)
    this.mapAddress.add( new THREE.AxesHelper())
    this.mapAddress.scale.setScalar(12)
    this.mapAddress.position.set(0, 2, 0)
    this.mapAddress.rotation.set(Math.PI/180 * -90, 0, 0)
    this.mapAddress.castShadow = true
    this.mapAddress.receiveShadow = true
    this.scene.add(this.mapAddress)
  }
  update() {}
}
