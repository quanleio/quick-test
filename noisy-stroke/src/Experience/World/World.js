import Experience from "../Experience.js"
import NoisyStroke from './NoisyStroke';

export default class World {
  constructor() {
    this.experience = new Experience()
    this.scene = this.experience.scene
    this.debug = this.experience.debug
    this.resources = this.experience.resources

    // Wait for resources
    this.resources.on("ready", () => {
      this.noisyStroke = new NoisyStroke()
    })
  }
  update() {
    if (this.noisyStroke) this.noisyStroke.update()
  }
}
