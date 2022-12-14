import Experience from '../Experience';
import * as THREE from 'three';
import {degToRad, randFloat} from 'three/src/math/MathUtils';
import Sphere from './Sphere';

export default class Balloon {
  constructor(_group, _grainMaterial) {
    this.experience = new Experience()
    this.scene = this.experience.scene
    this.time = this.experience.time
    this.group = _group
    this.grainMaterial = _grainMaterial
    this.balloons = []
    this.clock = new THREE.Clock()
    this.speed = randFloat(500, 1000)

    this.setBalloons()
  }
  setBalloons = () => {
    const dist = 3
    let angle = 0

    for (let i = 0; i < 5; i++) {
      const position = new THREE.Vector3(Math.cos(angle) * dist, randFloat(-1, 1), Math.sin(angle) * dist)
      const scale = randFloat(0.2, 0.6)
      const balloon = new Sphere(this.grainMaterial, scale, position)

      angle += degToRad(360 / 5)
      this.scene.add(balloon)
      this.balloons.push(balloon)
    }
  }
  update = () => {

    for (let i = 0; i < this.balloons.length; i++) {
      const balloon = this.balloons[i]
      // this.balloons[i].update(performance.now())

      balloon.position.y = THREE.MathUtils.lerp(balloon.position.y, (0.5 + Math.sin(this.time.elapsed / this.speed)) * 0.8, 0.5)
    }
  }
}
