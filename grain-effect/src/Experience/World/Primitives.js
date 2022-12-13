import * as THREE from 'three'
import Experience from '../Experience';
import Pillars from './Pillars';
import Balls from './Balls';

export default class Primitives {
  constructor(_group, _grainMaterial) {
    this.experience = new Experience()
    this.resources = this.experience.resources
    this.mouse = this.experience.mouse.mouse
    this.targetMouse = this.experience.mouse.targetMouse
    this.grainMaterial = _grainMaterial
    this.group = _group

    this.pillars = new Pillars(_group, _grainMaterial)
    this.balls = new Balls(_group, _grainMaterial)
  }
  setSpheres = () => {
    const dist = 3
    let angle = 0
    this.spheres = []

    for(let i =0; i< 5; i++){
      const position = new THREE.Vector3(Math.cos(angle)*dist, THREE.MathUtils.randFloat(-1, 1), Math.sin(angle)*dist)
      const scale = THREE.MathUtils.randFloat(0.3, 0.6)

      const sphere = new THREE.Mesh(
          new THREE.SphereGeometry(1, 32, 32),
          this.grainMaterial)

      this.initY = position.y
      this.initX = position.x
      this.offsetY = THREE.MathUtils.randFloat(0, 100)
      this.invSpeed = THREE.MathUtils.randFloat(1000, 1500)
      this.coefX = THREE.MathUtils.randFloat(0.5, 1)
      sphere.position.copy(position)
      sphere.scale.setScalar(scale)

      angle += THREE.MathUtils.degToRad(360/5)
      this.group.add(sphere)
      this.spheres.push(sphere)
    }
  }
  update = () => {
    // this.balls.update()
    // for(let i=0; i<this.balls.spheres.length; i++) {
      // this.spheres[i].position.y = this.initY + Math.sin(performance.now() / this.invSpeed + this.offsetY) * 0.5 + this.mouse.y * 0.2
      // this.spheres[i].position.x = this.initX + this.mouse.x * this.coefX
    // }
  }
}
