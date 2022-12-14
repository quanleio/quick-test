import * as THREE from 'three'
import {gsap, Power1} from 'gsap'
import Experience from "../Experience.js"
import Primitives from './Primitives'
import Statue from './Statue'
import Fox from './Fox'
import vertexShader from '../../shaders/grain.vert'
import fragmentShader from '../../shaders/grain.frag'

export default class World {
  constructor() {
    this.experience = new Experience()
    this.scene = this.experience.scene
    this.resources = this.experience.resources

    // container all children of scene
    this.group = new THREE.Group()
    this.group.rotation.y = THREE.MathUtils.degToRad(-100)
    this.group.position.y = -2
    this.scene.add(this.group)

    this.setGrainMaterial()

    // Wait for resources
    this.resources.on("ready", () => {
      this.setGround()
      this.primitives = new Primitives(this.group, this.grainMaterial)
      this.statue = new Statue(this.group, this.grainMaterial)
    })
  }

  /**
   * Free download: https://sketchfab.com/3d-models/rocky-ground-with-moss-2c0386dd36124ad78f37dbf6432eac21
   */
  setGround = () => {
    this.ground = this.resources.items.rockyGround.scene
    this.ground.position.y = -2
    this.ground.traverse(child => {
      if(child.material) child.material = this.grainMaterial
    })
    this.group.add(this.ground)
  }
  setGrainMaterial = () => {
    const uniforms = {
      uLightPos: {
        value: [new THREE.Vector3(0, 3, 1), new THREE.Vector3(10, 3, 1)],
      },
      uLightColor: {
        value: [new THREE.Color(0x555555), new THREE.Color(0x555555)],
      },
      uLightIntensity: { value: 1.1},
      uNoiseCoef: { value: 5.4},
      uNoiseMin: { value: 0.76 },
      uNoiseMax: { value: 4},
      uNoiseScale: {value: 0.8},
      // uColor: { value: new THREE.Color(0x749bff)},
      uColor: { value: new THREE.Color(0xa5c9a5)},
    }
    this.grainMaterial = new THREE.ShaderMaterial({
      vertexShader: vertexShader,
      fragmentShader: fragmentShader,
      uniforms: uniforms
    })
  }
  update() {
    if (this.primitives) this.primitives.update()
    if (this.statue) this.statue.update()
  }
}
