import Experience from "../Experience.js"
import Fox from "./Fox.js"
import Address from './Address';

export default class World {
  constructor() {
    this.experience = new Experience()
    this.scene = this.experience.scene
    this.resources = this.experience.resources

    // Wait for resources
    this.resources.on("ready", () => {
      // Setup
      // this.fox = new Fox()
      this.map = new Address()
    })
  }

  update() {
    // if (this.fox) this.fox.update()
    if (this.map) this.map.update()
  }
}
