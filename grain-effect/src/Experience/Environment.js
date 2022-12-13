import Experience from './Experience'

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
    this.scene.background = this.resources.items.sceneBackground
  }
}
