import * as THREE from 'three'
import Experience from '../Experience';

export default class Primitives {
  constructor(_grainMaterial) {
    this.experience = new Experience()
    this.scene = this.experience.scene
    this.resources = this.experience.resources
    this.mouse = this.experience.mouse.mouse
    this.targetMouse = this.experience.mouse.targetMouse
    this.grainMaterial = _grainMaterial

    this.group = new THREE.Group()
    // this.group.add( new THREE.AxesHelper(10))
    // this.group.rotateY(-60)
    this.scene.add(this.group)

    this.setCylinders()
    this.setSpheres()
    // this.setModel()
  }
  setCylinders = () => {
    const dist = 6
    let angle = 0

    for (let i=0; i<5; i++) {
      const position = new THREE.Vector3(Math.cos(angle) * dist, -2, Math.sin(angle) * dist)
      const scale = THREE.MathUtils.randFloat(.6, 1.2)

      const cylinder = new THREE.Mesh(
          new THREE.CylinderGeometry(.5, .5, 4, 32),
          this.grainMaterial
      )
      cylinder.position.copy(position)
      cylinder.scale.set(1, scale, 1)

      angle += THREE.MathUtils.degToRad(360/5)
      this.group.add(cylinder)
    }
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

    /*for (let i = 0; i < 5; i++) {
      const position = new THREE.Vector3(Math.cos(angle) * dist, THREE.MathUtils.randFloat(-1, 1), Math.sin(angle) * dist)
      const scale = THREE.MathUtils.randFloat(0.3, 0.6)
      const object3D = new Sphere(this.grainMaterial, scale, position)

      angle += THREE.MathUtils.degToRad(360 / 5)
      this.scene.add(object3D)
      this.spheres.push(object3D)
    }*/

  }
  setModel = () => {
    this.model = this.resources.items.deerModel
    this.model.scale.setScalar(1/200)
    this.model.position.y = -1.5
    this.model.translateY(-2)

    this.model.traverse(child => {
      child.material = this.grainMaterial;
    });

    this.group.add(this.model)
  }
  update = () => {
    this.mouse.x = THREE.MathUtils.lerp(this.mouse.x, this.targetMouse.x, 0.1)
    this.mouse.y = THREE.MathUtils.lerp(this.mouse.y, this.targetMouse.y, 0.1)
    this.group.rotation.y = THREE.MathUtils.degToRad(20 * this.mouse.x)

    for(let i=0; i<this.spheres.length; i++) {
      // this.spheres[i].render(performance.now(), this.mouse)

      // this.spheres[i].position.y = this.initY + Math.sin(performance.now() / this.invSpeed + this.offsetY) * 0.5 + this.mouse.y * 0.2
      // this.spheres[i].position.x = this.initX + this.mouse.x * this.coefX
    }
  }
}
