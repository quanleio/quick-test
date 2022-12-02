import * as THREE from 'three';
import Experience from './Experience';

export default class Environment {
  constructor() {
    this.experience = new Experience()
    this.scene = this.experience.scene

    this.setLight()
  }
  setLight = () => {
    const light = new THREE.DirectionalLight(0xffffff, 1)
    light.position.set(5, 7, 10)
    light.castShadow = true
    this.scene.add( light )
  }
}
