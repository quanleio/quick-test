import * as THREE from 'three'
import Experience from '../Experience'
import vertexShader from '../../shaders/particles.vert'
import fragmentShader from '../../shaders/particles.frag'

export default class VertexParticle {
  constructor(_debugFolder) {
    this.experience = new Experience()
    this.scene = this.experience.scene
    this.resources = this.experience.resources
    this.debugFolder = _debugFolder

    this.setModel()
    this.setParticle()
  }
  setModel = () => {
    this.model = this.resources.items.skull.scene
    this.facePos = []
    this.model.traverse(child => {
      if (child.isMesh) {
        child.geometry.rotateY(Math.PI/180 * -90)
        child.geometry.translate(0, 0.2, 0)
        this.facePos.push(...child.geometry.attributes.position.array)
      }
    })

    this.faceNumber = this.facePos.length / 3
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

    // Apply particle geometry to model (if using model)
    this.buffGeometry = new THREE.BufferGeometry()
    this.model.traverse(child => {
      if (child.isMesh) {
        this.buffGeometry = child.geometry
      }
    })

    // if using premitive sphere
    this.sphereGeometry = new THREE.IcosahedronGeometry(1, 100)

    this.particle = new THREE.Points(this.sphereGeometry, this.material)
    // this.scene.add(this.particle)

    // debug
    if (this.debugFolder) {
      const debugObject = {
        'Skull Model': false,
      }
      this.debugFolder.add(debugObject, 'Skull Model').onChange(val => {
        val ? this.particle.geometry = this.buffGeometry : this.particle.geometry = this.sphereGeometry
      })
    }
  }
  update = (isEnabled) => {
    if (isEnabled) {
      this.scene.add(this.particle)
      this.material.uniforms.time.value = performance.now() / 1000;
    }
    else {
      this.scene.remove(this.particle)
    }
  }
}
