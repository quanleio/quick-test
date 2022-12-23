import * as THREE from 'three'
import Experience from './Experience'

export default class Environment {
  constructor() {
    this.experience = new Experience()
    this.scene = this.experience.scene
    this.resources = this.experience.resources
    this.debug = this.experience.debug

    // debug
    if (this.debug.active) {
      this.debugFolder = this.debug.ui.addFolder('Lights')
    }

    // Wait for resources
    this.resources.on("ready", () => {
      this.setEnv()
    });

    this.setLights()
  }
  setEnv = () => {
    // this.scene.background = new THREE.Color(0xa5c9a5)
  }
  setLights = () => {
    const light = new THREE.DirectionalLight(0xffffff, 1)
    light.position.set(5, 7, 10)
    light.castShadow = true
    this.scene.add( light )
  }
}
