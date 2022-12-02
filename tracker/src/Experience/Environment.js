import * as THREE from 'three';
import Experience from './Experience';

export default class Environment {
  constructor() {
    this.experience = new Experience()
    this.scene = this.experience.scene
    this.resources = this.experience.resources

    // Wait for resources
    this.resources.on("ready", () => {
      // this.setHDRI()
    })
    this.setLight()
  }
  setLight = () => {
    const light = new THREE.DirectionalLight(0xffffff, 1)
    light.position.set(5, 7, 10)
    light.castShadow = true
    this.scene.add( light )
  }
  setHDRI = () => {
    this.resource = this.resources.items.envHDRI
    this.resource.mapping = THREE.EquirectangularReflectionMapping;
    this.scene.environment = this.resource;
  }
  update = () => {}
}
