import Experience from '../Experience';
import * as THREE from 'three';
import {degToRad, randFloat} from 'three/src/math/MathUtils';

export default class Balls {
  constructor(_group, _grainMaterial) {
    this.experience = new Experience()
    this.time = this.experience.time
    this.group = _group
    this.grainMaterial = _grainMaterial
    this.spheres = []
    this.speed = randFloat(1000, 1500)

    this.setBalls()
  }
  setBalls = () => {
    const dist = 3
    let angle = 0

    for(let i=0; i<5; i++){
      const position = new THREE.Vector3(Math.cos(angle)*dist, randFloat(0, 4), Math.sin(angle)*dist)
      const scale = randFloat(0.3, 0.6)
      const geometry = new THREE.SphereGeometry(1, 32, 32)
      const sphere = new THREE.Mesh(geometry, this.grainMaterial)

      sphere.position.copy(position)
      sphere.scale.setScalar(scale)
      this.group.add(sphere)
      this.spheres.push(sphere)
      angle += degToRad(360/5)
    }
  }
  update = () => {
    for(let i=0; i<this.spheres.length; i++){
      const ball = this.spheres[i]
      ball.position.y = THREE.MathUtils.lerp(ball.position.y, (0.5 + Math.sin(performance.now() / this.speed)) * 2, 0.5)

      // ball.position.y = this.initY + Math.sin(performance.now() / this.speed + this.offsetY) * 0.5
      // ball.position.x = this.initX * this.coefX

      // ball.scale.x = THREE.MathUtils.lerp(ball.scale.x, (-0.6 + Math.sin(performance.now() / this.speed)) * 0.6, 0.5)
      // ball.scale.y = THREE.MathUtils.lerp(ball.scale.y, (-0.6 + Math.sin(performance.now() / this.speed)) * 0.6, 0.5)
      // ball.scale.z = THREE.MathUtils.lerp(ball.scale.z, (-0.6 + Math.sin(performance.now() / this.speed)) * 0.6, 0.5)
    }
  }
}
