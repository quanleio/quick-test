import * as THREE from 'three';
import Experience from "../Experience.js";
import Primitives from './Primitives';
import Fox from './Fox';
import vertexShader from '../../shaders/grain.vert';
import fragmentShader from '../../shaders/grain.frag';

export default class World {
  constructor() {
    this.experience = new Experience();
    this.resources = this.experience.resources;

    this.setGrainMaterial()

    // Wait for resources
    this.resources.on("ready", () => {
      this.primitives = new Primitives(this.grainMaterial)
      this.fox = new Fox(this.grainMaterial)
    });
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
      uColor: { value: new THREE.Color(0x749bff)},
    }
    this.grainMaterial = new THREE.ShaderMaterial({
      vertexShader: vertexShader,
      fragmentShader: fragmentShader,
      uniforms: uniforms
    })
  }
  update() {
    if (this.primitives) this.primitives.update();
    if (this.fox) this.fox.update()
  }
}
