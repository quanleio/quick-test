import * as THREE from 'three'
import { ImprovedNoise } from 'three/examples/jsm/math/ImprovedNoise'
import Experience from '../Experience'
import {randFloat} from 'three/src/math/MathUtils';

export default class Flag {
  constructor() {
    this.experience = new Experience()
    this.scene = this.experience.scene
    this.resources = this.experience.resources
    this.perlin = new ImprovedNoise()
    this.speed = randFloat(500, 1000)
    this.clock = new THREE.Clock()
    this.debug = this.experience.debug

    this.setMap()
  }
  setMap = () => {
    const geometry = new THREE.PlaneGeometry(20, 10, 32, 32)
    geometry.rotateX(Math.PI * -0.5)
    const material = new THREE.MeshBasicMaterial({
      map: this.resources.items.flagOfKorea,
      side: THREE.DoubleSide
    })
    const flag = new THREE.Mesh(geometry, material)
    this.scene.add(flag)

    this.position = geometry.attributes.position
    this.uv = geometry.attributes.uv
    this.vUv = new THREE.Vector2()
  }
  update = () => {
    let t = this.clock.getElapsedTime()
    // const t = performance.now() / this.speed
    for(let i=0; i<this.position.count; i++) {
      this.vUv.fromBufferAttribute(this.uv, i).multiplyScalar(2.5)
      const y = this.perlin.noise(this.vUv.x, this.vUv.y + t,  t * 0.1)
      this.position.setY(i, y)
    }
    this.position.needsUpdate = true
  }
}
