import * as THREE from 'three'
import Experience from './Experience'

export default class Environment {
  constructor() {
    this.experience = new Experience()
    this.scene = this.experience.scene
    this.resources = this.experience.resources

    this.addLights()

    // Wait for resources
    this.resources.on("ready", () => {
      this.setEnv()
    });
  }
  addLights = () => {
    const light1 = new THREE.AmbientLight(0xffffff, 0.8)
    this.scene.add(light1)

    // const light2 = new THREE.DirectionalLight(0xffffff, 0.5)
    // light2.position.set(0.5, 0, 0.866)
    // this.scene.add(light2)

    const light = new THREE.SpotLight(0xffffff, 3, 10, Math.PI/3, 0.3)
    light.position.set(0, 2, 2)
    light.target.position.set(0, 0, 0)

    light.castShadow = true
    light.shadow.camera.near = 0.1
    light.shadow.camera.far = 9
    light.shadow.bias = 0.0001
    light.shadow.mapSize.width = 2048
    light.shadow.mapSize.height = 2048

    this.scene.add(light)
  }
  setEnv = () => {
    // this.scene.background = new THREE.Color(0xa5c9a5)
    // this.scene.background = this.resources.items.sceneBackground
  }
  update = () => {
    this.experience.update()
  }
}
