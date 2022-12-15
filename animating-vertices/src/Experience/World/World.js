import Experience from "../Experience.js"
import Flag from './Flag';
import WallShapes from './WallShapes';

export default class World {
  constructor() {
    this.experience = new Experience()
    this.scene = this.experience.scene
    this.debug = this.experience.debug
    this.resources = this.experience.resources

    // Wait for resources
    this.resources.on("ready", () => {
      // this.flag = new Flag()

      // https://tympanus.net/codrops/2018/12/06/interactive-repulsion-effect-with-three-js/
      this.wall = new WallShapes()
    })
  }
  update() {
    // if (this.flag) this.flag.update()
    if (this.wall) this.wall.update()
  }
}
