import * as THREE from 'three'
import { ImprovedNoise } from 'three/examples/jsm/math/ImprovedNoise'
import Experience from '../Experience'
import {randFloat} from 'three/src/math/MathUtils';
import grainVertex from '../../shaders/grain.vert'
import grainFragment from '../../shaders/grain.frag'

export default class Flag {
  constructor() {
    this.experience = new Experience()
    this.scene = this.experience.scene
    this.resources = this.experience.resources
    this.perlin = new ImprovedNoise()
    this.speed = randFloat(500, 1000)
    this.clock = new THREE.Clock()
    this.debug = this.experience.debug

    this.weight = [0.2126, 0.7152, 0.0722]
    this.zRange = 120
    this.grainSetting = {
      uLightIntensity: 1.1,
      uNoiseCoef: 5.4,
      uNoiseMin: 0.76,
      uNoiseMax: 4,
      uNoiseScale: 0.8,
      light_1: 0.7,
      light_2: 8,
    }

    this.createGrainMaterial()
    this.setMap()
  }
  createGrainMaterial = () => {
    const uniforms = {
      uTexture: { value: this.resources.items.city},
      uResolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight)},
      uLightPos: {
        value: [new THREE.Vector3(0, 100, 8), new THREE.Vector3(0, 100, 8)]
      },
      uLightColor: {
        value: [new THREE.Color(0x555555), new THREE.Color(0x555555)]
      },
      uLightIntensity: { value: this.grainSetting.uLightIntensity},
      uNoiseCoef: { value: this.grainSetting.uNoiseCoef},
      uNoiseMin: { value: this.grainSetting.uNoiseMin},
      uNoiseMax: { value: this.grainSetting.uNoiseMax},
      uNoiseScale: { value: this.grainSetting.uNoiseScale},
      uColor: { value: new THREE.Color(0xa5c9a5)}
    }
    this.grainMaterial = new THREE.ShaderMaterial({
      uniforms: uniforms,
      vertexShader: grainVertex,
      fragmentShader: grainFragment,
      side: THREE.DoubleSide,
    })
  }
  setMap = () => {
    const geometry = new THREE.PlaneGeometry(40, 18, 32, 32)
    geometry.rotateX(Math.PI * 0.5)
    geometry.center()

    const material = new THREE.MeshBasicMaterial({
      map: this.resources.items.city,
      side: THREE.DoubleSide,
      transparent: true,
    })
    const flag = new THREE.Mesh(geometry, material)
    flag.rotation.x = Math.PI/180 * -120
    this.scene.add(flag)

    this.position = geometry.attributes.position
    this.uv = geometry.attributes.uv
    this.vUv = new THREE.Vector2()
  }
  update = () => {
    let t = this.clock.getElapsedTime()
    for(let i=0; i<this.position.count; i++) {
      this.vUv.fromBufferAttribute(this.uv, i).multiplyScalar(2.5)
      const y = this.perlin.noise(this.vUv.x, this.vUv.y + t,  t * 0.1)
      this.position.setY(i, y)
    }
    this.position.needsUpdate = true
  }
}
