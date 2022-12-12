import * as THREE from 'three'
import Experience from '../Experience';
import vertexShader from '../../shaders/grain.vert'
import fragmentShader from '../../shaders/grain.frag'

export default class SphereGrain {
  constructor() {
    this.experience = new Experience()
    this.scene = this.experience.scene

    this.setSphereObject()
    this.setMaterial()
  }

  setSphereObject = () => {
    const geometry = new THREE.SphereGeometry(1, 64, 64)
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
        uColor: { value: new THREE.Color(0xbb0033)},
        uLightPos: { value: new THREE.Vector3(0, 5, 3)},
        uLightColor: { value: new THREE.Color(0xffffff)},
        uLightIntensity: { value: 0.7}
      }
    })

    this.sphereGrain.material = material
  }

  update = () => {
    //
  }
}
