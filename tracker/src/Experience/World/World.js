import Experience from "../Experience.js"
import Address from './Address';

export default class World {
  constructor() {
    this.experience = new Experience()
    this.scene = this.experience.scene
    this.resources = this.experience.resources

    // Wait for resources
    this.resources.on("ready", () => {
      // Setup
      this.map = new Address()
    })
  }

  update() {
    if (this.map) this.map.update()
  }
}
