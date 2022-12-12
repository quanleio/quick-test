import * as THREE from 'three'
import Experience from '../Experience';
import vertexShader from '../../shaders/vertexShader.glsl'
import fragmentShader from '../../shaders/fragmentShader.glsl'

export default class SphereGrain {
  constructor() {
    this.experience = new Experience()
    this.scene = this.experience.scene

    this.setSphereObject()
    this.setMaterial()
  }

  setSphereObject = () => {
    const geometry = new THREE.SphereGeometry(1, 32, 32)
    const material = new THREE.MeshBasicMaterial({
      color: 'black',
      wireframe: true
    })
    this.sphereGrain = new THREE.Mesh(geometry, material)
    this.scene.add(this.sphereGrain)
  }

  setMaterial = () => {
    const material = new THREE.ShaderMaterial({
      vertexShader: vertexShader,
      fragmentShader: fragmentShader,
      uniforms: {
        uColor: { value: new THREE.Color(0xbb0033)}
      }
    })

    this.sphereGrain.material = material
  }

  update = () => {
    //
  }
}
