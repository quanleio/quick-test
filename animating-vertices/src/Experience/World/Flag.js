import * as THREE from 'three'
import { ImprovedNoise } from 'three/examples/jsm/math/ImprovedNoise'
import Experience from '../Experience'

export default class Flag {
  constructor() {
    this.experience = new Experience()
    this.scene = this.experience.scene
    this.resources = this.experience.resources
    this.perlin = new ImprovedNoise()
    this.clock = new THREE.Clock()
    this.weight = [0.2126, 0.7152, 0.0722]
    this.zRange = 120
    this.debug = this.experience.debug

    this.setMap()
  }
  setMap = () => {
    const geometry = new THREE.PlaneGeometry(40, 18, 32, 32)
    geometry.rotateX(Math.PI * 0.5)
    geometry.center()

    const material = new THREE.MeshBasicMaterial({
      map: this.resources.items.city,
      side: THREE.DoubleSide,
      transparent: true,
    })
    const flag = new THREE.Mesh(geometry, material)
    flag.rotation.x = Math.PI/180 * -120
    this.scene.add(flag)

    this.position = geometry.attributes.position
    this.uv = geometry.attributes.uv
    this.vUv = new THREE.Vector2()
  }
  update = () => {
    let t = this.clock.getElapsedTime()
    for(let i=0; i<this.position.count; i++) {
      this.vUv.fromBufferAttribute(this.uv, i).multiplyScalar(2.5)
      const y = this.perlin.noise(this.vUv.x, this.vUv.y + t,  t * 0.1)
      this.position.setY(i, y)
    }
    this.position.needsUpdate = true
  }
}
