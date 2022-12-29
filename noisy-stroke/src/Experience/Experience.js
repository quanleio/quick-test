import * as THREE from "three"
import Sizes from "../utils/Sizes.js"
import Time from "../utils/Time.js"
import Camera from "./Camera.js"
import Renderer from "./Renderer.js"
import World from "./World/World.js"
import Resources from "../utils/Resources.js"
import Stats from "../utils/Stats.js"
import sources from "./sources.js"
import Environment from './Environment'
import Mouse from '../utils/Mouse';
import Debug from '../utils/Debug';

let instance = null

export default class Experience {
  constructor() {
    /**Singleton */
    if (instance) {
      return instance
    }
    instance = this

    /**Global Access */
    window.experience = this

    /**Canvas*/
    const _canvas = document.createElement("canvas")
    _canvas.id = 'experience'
    document.body.appendChild(_canvas)
    this.canvas = _canvas

    this.createDOM()

    /**Setup Classes */
    this.debug = new Debug()
    this.stats = new Stats()
    this.sizes = new Sizes()
    this.time = new Time()
    this.mouse = new Mouse()
    this.resources = new Resources(sources)

    this.scene = new THREE.Scene()
    this.environment = new Environment()
    this.camera = new Camera()
    this.renderer = new Renderer()
    this.world = new World()

    this.sizes.on("resize", () => this.resize())
    this.time.on("tick", () => this.update())
  }

  createDOM = () => {
    const section_1 = document.createElement('section')
    section_1.classList.add('section-one')
    document.body.appendChild(section_1)

    const section_2 = document.createElement('section')
    section_2.classList.add('section-two')
    document.body.appendChild(section_2)

    const section_3 = document.createElement('section')
    section_3.classList.add('section-three')
    document.body.appendChild(section_3)

    const section_4 = document.createElement('section')
    section_4.classList.add('section-four')
    document.body.appendChild(section_4)

    const section_5 = document.createElement('section')
    section_5.classList.add('section-five')
    document.body.appendChild(section_5)

    const section_6 = document.createElement('section')
    section_6.classList.add('section-six')
    document.body.appendChild(section_6)

    const section_7 = document.createElement('section')
    section_7.classList.add('section-seven')
    document.body.appendChild(section_7)
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
