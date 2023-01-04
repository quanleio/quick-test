import Experience from "../Experience.js"
import NoisyStroke from './NoisyStroke';
import ModelSet from './components/ModelSet';
import CameraPath from './CameraPath';

export default class World {
  constructor() {
    this.experience = new Experience()
    this.scene = this.experience.scene
    this.debug = this.experience.debug
    this.resources = this.experience.resources

    // Wait for resources
    this.resources.on("ready", () => {
      this.noisyStroke = new NoisyStroke()

      this.cameraPath = new CameraPath(this.noisyStroke.material)
      // this.modelSet = new ModelSet(this.noisyStroke.material)
    })
  }
  update() {
    if (this.noisyStroke) this.noisyStroke.update()
    if (this.cameraPath) this.cameraPath.update()
    // if (this.modelSet) this.modelSet.update()
  }
}
