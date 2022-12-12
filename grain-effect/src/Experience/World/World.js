import Experience from "../Experience.js";
import SphereGrain from './SphereGrain';

export default class World {
  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.resources = this.experience.resources;

    // Wait for resources
    this.resources.on("ready", () => {
      // Setup
      this.sphereGrain = new SphereGrain()
    });
  }

  update() {
    if (this.sphereGrain) this.sphereGrain.update();
  }
}
