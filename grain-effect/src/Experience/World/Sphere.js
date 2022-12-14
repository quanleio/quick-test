import * as THREE from 'three'
import { randFloat } from 'three/src/math/MathUtils'

export default class Sphere extends THREE.Object3D {
  constructor(material, scale, position) {
    super()

    const geometry = new THREE.SphereGeometry(1, 32, 32)
    const mesh = new THREE.Mesh(geometry, material)
    mesh.scale.set(scale, scale, scale)

    this.initY = position.y
    this.initX = position.x
    this.speed = randFloat(500, 1000)

    this.position.copy(position)
    this.add(mesh)
  }
  update(now) {
    this.position.y = THREE.MathUtils.lerp(this.position.y, (0.5 + Math.sin(now / this.speed)) * 0.8, 0.5)
  }
}
