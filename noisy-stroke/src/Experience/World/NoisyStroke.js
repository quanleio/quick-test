import * as THREE from 'three'
import Experience from '../Experience'
import vertexShader from '../../shaders/stroke.vert'
import fragmentShader from '../../shaders/stroke.frag'

export default class NoisyStroke {
  constructor() {
    this.experience = new Experience()
    this.scene = this.experience.scene
    this.resources = this.experience.resources
    this.debug = this.experience.debug

    this.setting = {
      progress: 0
    }

    this.setMaterial()
    this.setObject()
    this.setModels()
  }
  setMaterial = () => {
    this.material = new THREE.ShaderMaterial({
      extensions: {
        derivatives: "#extension GL_OES_standard_derivatives : enable"
      },
      side: THREE.DoubleSide,
      uniforms: {
        ...THREE.UniformsLib.lights,
        ...THREE.UniformsLib.fog,
        uTime: { value: 0 },
        uProgress: { value: 0},
        uNoiseTexture: { value: this.resources.items.noiseTexture},
        uColor: { value: new THREE.Color('#b87333') },
        fogColor:    { type: "c", value: this.scene.fog.color },
        fogNear:     { type: "f", value: this.scene.fog.near },
        fogFar:      { type: "f", value: this.scene.fog.far }
      },
      lights: true,
      fog: true,
      vertexShader: vertexShader,
      fragmentShader: fragmentShader
    })

    // debug
    if (this.debug.active) {
      this.debug.ui.add(this.setting, "progress", 0, 1, 0.0008)
    }
  }
  setModels = () => {
    // fox
    const fox = this.resources.items.foxModel.scene
    fox.scale.setScalar(1/45)
    fox.position.set(0, -.7, 0)
    fox.rotation.y = Math.PI/180 * -30
    fox.traverse(child => {
      if (child.material) {
        child.material = this.material
      }
    })
    // this.scene.add(fox)

    // face
    const face = this.resources.items.oldFace.scene
    face.scale.setScalar(2)
    face.position.set(0, 0.5, 0)
    face.receiveShadow = face.castShadow = true

    face.traverse(child => {
      if (child.material) {
        child.material = this.material
      }
      if(child.geometry) {
        child.geometry.center()
      }
    })
    this.scene.add(face)
  }
  setObject = () => {
    // const geometry = new THREE.SphereGeometry(2, 64, 64)
    const geometry = new THREE.BoxGeometry(3, 3, 3, 10, 10, 10)

    // sphere
    this.sphere = new THREE.Mesh(geometry, this.material)
    // this.scene.add(this.sphere)

    const cube = new THREE.Mesh(geometry, new THREE.MeshStandardMaterial({
      color: 'white'
    }))
    cube.position.x = 5
    this.scene.add(cube)
  }
  update = () => {
    // this.sphere.rotation.x = performance.now() / 2000
    // this.sphere.rotation.y = performance.now() / 2000

    this.material.uniforms.uTime.value = performance.now() / 2000
    this.material.uniforms.uProgress.value = this.setting.progress
  }
}
