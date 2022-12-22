import Experience from "../Experience.js"
import FboSimulation from './FboSimulation';
import VertexParticle from './VertexParticle';

export default class World {
  constructor() {
    this.experience = new Experience()
    this.scene = this.experience.scene
    this.debug = this.experience.debug
    this.resources = this.experience.resources

    // Wait for resources
    this.resources.on("ready", () => {
      this.vertexParticle = new VertexParticle()
      // this.fbo = new FboSimulation()
    })
  }
  update() {
    if (this.vertexParticle) this.vertexParticle.update()
    // if (this.fbo) this.fbo.update()
  }
}
