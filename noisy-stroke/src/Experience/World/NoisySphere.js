import * as THREE from 'three'
import Experience from '../Experience'
import vertexShader from '../../shaders/stroke.vert'
import fragmentShader from '../../shaders/stroke.frag'

export default class NoisySphere {
  constructor() {
    this.experience = new Experience()
    this.scene = this.experience.scene
    this.resources = this.experience.resources
    console.log(this.resources.items)
    this.debug = this.experience.debug

    this.setting = {
      progress: 0
    }

    this.setObject()
  }
  setObject = () => {
    // const geometry = new THREE.SphereGeometry(1, 30, 30)
    const geometry = new THREE.BoxGeometry(1, 1, 1, 10, 10, 10)

    this.material = new THREE.ShaderMaterial({
      extensions: {
        derivatives: "#extension GL_OES_standard_derivatives : enable"
      },
      side: THREE.DoubleSide,
      uniforms: {
        uTime: { value: 0 },
        uProgress: { value: 0},
        uNoiseTexture: { value: this.resources.items.noiseTexture},
        resolution: { value: new THREE.Vector4()},
      },
      vertexShader: vertexShader,
      fragmentShader: fragmentShader
    })

    // sphere
    this.sphere = new THREE.Mesh(geometry, this.material)
    // this.scene.add(this.sphere)

    // model
    this.model = this.resources.items.oldFace.scene
    this.animations = this.resources.items.oldFace.animations
    // this.model.scale.setScalar(1/1.5)
    this.model.traverse(child => {
      if (child.material) {
        child.material = this.material
      }
    })
    this.scene.add(this.model)

    //debug
    if (this.debug.active) {
      this.debug.ui.add(this.setting, "progress", 0, 1, 0.01)
    }
  }
  setAnimation = () => {
    this.mixer = new THREE.AnimationMixer(this.model)
    const action = this.mixer.clipAction(this.animations[0])
    action.play()
  }
  update = () => {
    // this.sphere.rotation.x = performance.now() / 2000
    // this.sphere.rotation.y = performance.now() / 2000

    this.material.uniforms.uTime.value = performance.now() / 2000
    this.material.uniforms.uProgress.value = this.setting.progress
  }
}
