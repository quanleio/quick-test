import Experience from "../Experience.js"
import NoisyStroke from './NoisyStroke';
import ModelSet from './components/ModelSet';
import CameraPath from './CameraPath';
import Primitives from './Primitives';

export default class World {
  constructor() {
    this.experience = new Experience()
    this.scene = this.experience.scene
    this.debug = this.experience.debug
    this.resources = this.experience.resources

    // Wait for resources
    this.resources.on("ready", () => {
      this.noisyStroke = new NoisyStroke()

      this.primitives = new Primitives(this.noisyStroke.material)
      this.cameraPath = new CameraPath(this.primitives)
      // this.modelSet = new ModelSet(this.noisyStroke.material)
    })
  }
  update() {
    if (this.primitives) this.primitives.update()
    if (this.cameraPath) this.cameraPath.update()
    // if (this.modelSet) this.modelSet.update()
  }
}
