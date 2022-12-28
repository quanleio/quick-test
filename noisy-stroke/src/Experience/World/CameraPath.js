import * as THREE from 'three'
import Experience from '../Experience'

export default class CameraPath {
  constructor() {
    this.experience = new Experience()
    this.scene = this.experience.scene
    this.camera = this.experience.camera.instance

    this.count = 6
    this.pos = []

    this.makePath()
    window.addEventListener('wheel', this.updateCamera)
  }
  makePath = () => {
    const geo = new THREE.SphereGeometry(1/4, 32, 32)
    const mat = new THREE.MeshNormalMaterial()

    for(let i=0; i<this.count; i++) {
      const sphere = new THREE.Mesh(geo, mat)

      let xPos = THREE.MathUtils.randFloat(-10, 10)
      let yPos = 0
      let zPos = THREE.MathUtils.randFloat(3, -10);
      sphere.position.set(xPos, yPos, zPos)

      this.scene.add(sphere)
      this.pos.push(sphere.position)
    }
  }
  updateCamera = (ev) => {

    // this.camera.position.x = 10 - window.scrollY / 500.0;
    // this.camera.position.z = 10 - window.scrollY / 500.0;
    // this.camera.position.z = -1.5 + window.scrollY / 250.0;

    console.log(ev)
    for(let i =0; i<this.pos.length; i++) {
      const pos = this.pos[i]
      // console.log(pos)
    }
  }
  update = () => {

  }
}
