import Experience from "../Experience.js"
import Fox from './Fox';
import Triangles from './Triangles';
// import vertexShader from '../../shaders/temp.vert'
// import fragmentShader from '../../shaders/temp.frag'

export default class World {
  constructor() {
    this.experience = new Experience()
    this.scene = this.experience.scene
    this.debug = this.experience.debug
    this.resources = this.experience.resources

    // Wait for resources
    this.resources.on("ready", () => {
      this.triangle = new Triangles()
    })
  }
  update() {
    if (this.triangle) this.triangle.update()
  }
}
