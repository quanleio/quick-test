import * as THREE from "three"
import Debug from "./Utils/Debug.js"
import Sizes from "./Utils/Sizes.js"
import Time from "./Utils/Time.js"
import Camera from "./Camera.js"
import Renderer from "./Renderer.js"
import World from "./World/World.js"
import Resources from "./Utils/Resources.js"
import Stats from "./Utils/Stats.js"
import sources from "./sources.js"
import Environment from './Environment';

export default class Experience {
  static instance

  constructor(_canvas) {
    if (Experience.instance) return Experience.instance
    Experience.instance = this

    window.experience = this

    this.canvas = _canvas

    /**Setup Classes */
    this.debug = new Debug()
    this.sizes = new Sizes()
    this.time = new Time()
    this.scene = new THREE.Scene()
    this.resources = new Resources(sources)
    this.environment = new Environment()
    this.camera = new Camera()
    this.renderer = new Renderer()
    this.world = new World()
    this.stats = new Stats()

    this.sizes.on("resize", () => this.resize())
    this.time.on("tick", () => this.update())
  }
  resize() {
    this.camera.resize()
    this.renderer.resize()
  }
  update() {
    /**Begin analyzing frame */
    this.stats.active && this.stats.beforeRender()

    /**update everything */
    this.camera.update()
    this.world.update()
    this.renderer.update()

    /**Finish analyzing frame */
    this.stats.active && this.stats.afterRender()
  }
  destroy() {
    console.log('destroy')
    /**Clear Event Emitter*/
    this.sizes.off("resize")
    this.time.off("tick")

    /**Traverse the whole scene and check if it's a mesh */
    this.scene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.geometry.dispose()

        /**Loop through the material properties */
        for (const key in child.material) {
          const value = child.material[key]

          /**Test if there is a dispose function */
          if (value && typeof value.dispose === "function") {
            value.dispose()
          }
        }
      }
    })

    this.camera.controls.dispose()
    this.renderer.instance.dispose()

    if (this.debug.active) {
      this.debug.ui.destroy()
    }

    if (this.stats.active) {
      this.stats.ui.destroy()
    }
  }
}
