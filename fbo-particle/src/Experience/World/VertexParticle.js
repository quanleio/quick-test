import * as THREE from 'three'
import Experience from '../Experience'
import vertexShader from '../../shaders/particles.vert'
import fragmentShader from '../../shaders/particles.frag'

export default class VertexParticle {
  constructor() {
    this.experience = new Experience()
    this.scene = this.experience.scene

    this.setParticle()
  }
  setParticle = () => {
    this.material = new THREE.ShaderMaterial({
      side: THREE.DoubleSide,
      uniforms: {
        time: { value: 0},
      },
      vertexShader: vertexShader,
      fragmentShader: fragmentShader,
      blending: THREE.AdditiveBlending
    })

    const geometry = new THREE.IcosahedronGeometry(1, 100)
    const particle = new THREE.Points(geometry, this.material)
    this.scene.add(particle)
  }
  update = () => {
    this.material.uniforms.time.value = performance.now() / 1000
  }
}
