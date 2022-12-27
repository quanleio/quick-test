import Experience from "../Experience.js"
import NoisySphere from './NoisySphere';

export default class World {
  constructor() {
    this.experience = new Experience()
    this.scene = this.experience.scene
    this.debug = this.experience.debug
    this.resources = this.experience.resources

    // Wait for resources
    this.resources.on("ready", () => {
      this.noisySphere = new NoisySphere()
    })
  }
  update() {
    if (this.noisySphere) this.noisySphere.update()
  }
}
