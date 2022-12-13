import Experience from './Experience'
import * as THREE from 'three';

export default class Environment {
  constructor() {
    this.experience = new Experience()
    this.scene = this.experience.scene
    this.resources = this.experience.resources

    // Wait for resources
    this.resources.on("ready", () => {
      this.setEnv()
    });

  }
  setEnv = () => {
    this.scene.background = new THREE.Color(0xa5c9a5)
    this.scene.background = this.resources.items.sceneBackground
  }
}
