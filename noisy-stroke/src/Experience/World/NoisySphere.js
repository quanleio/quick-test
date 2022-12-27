import * as THREE from 'three'
import Experience from '../Experience'
import vertexShader from '../../shaders/temp.vert'
import fragmentShader from '../../shaders/temp.frag'

export default class NoisySphere {
  constructor() {
    this.experience = new Experience()
    this.scene = this.experience.scene

    this.setObject()
  }
  setObject = () => {
    const geometry = new THREE.SphereGeometry(4, 64, 64)
    const material = new THREE.ShaderMaterial({
      side: THREE.DoubleSide,
      transparent: false,
      vertexShader: vertexShader,
      fragmentShader: fragmentShader
    })

    const sphere = new THREE.Mesh(geometry, material)
    this.scene.add(sphere)
  }
  update = () => {

  }
}
