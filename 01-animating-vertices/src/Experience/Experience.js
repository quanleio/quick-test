import * as THREE from "three"
import Sizes from "../utils/Sizes.js"
// import Time from "../utils/Time.js"
import Camera from "./Camera.js"
import Renderer from "./Renderer.js"
import World from "./World/World.js"
import Resources from "../utils/Resources.js"
import Stats from "../utils/Stats.js"

import sources from "./sources.js"
import Environment from './Environment'
import Debug from '../utils/Debug';
import PostEffect from './PostEffect';
import {EVT} from '../utils/contains';

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

    this.createDOM()

    /**Canvas*/
    const _canvas = document.createElement("canvas")
    _canvas.id = 'experience'
    document.body.appendChild(_canvas)
    this.canvas = _canvas

    /**Setup Classes */
    this.debug = new Debug()
    this.stats = new Stats()
    this.sizes = new Sizes()
    // this.time = new Time()
    this.resources = new Resources(sources)

    this.scene = new THREE.Scene()
    this.environment = new Environment()
    this.camera = new Camera()
    this.renderer = new Renderer()
    this.postEffect = new PostEffect()
    this.world = new World()

    this.sizes.on(EVT.RESIZE, () => this.resize())
    // this.time.on(EVT.TICK, () => this.update())
    this.tick()
  }

  createDOM = () => {
    const footer = document.createElement("div")
    footer.classList.add('footer')

    const note = document.createElement('p')
    note.innerHTML = 'Image Credit: '

    const linkNote = document.createElement('a')
    linkNote.innerHTML = 'Misato Town'
    linkNote.href = 'https://shiftbrain.com/work/misatoto/?lang=en'
    linkNote.target = 'blank'
    note.appendChild(linkNote)

    footer.appendChild(note)
    document.body.appendChild(footer)
  }

  resize() {
    this.camera.resize()
    this.renderer.resize()
    this.postEffect.resize()
  }

  update() {
    /**Begin analyzing frame */
    this.stats.active && this.stats.beforeRender()

    /**update everything */
    this.camera.update()
    this.world.update()
    // this.renderer.update() // Don't use this if using PostProcessing
    if(this.postEffect) this.postEffect.update()

    /**Finish analyzing frame */
    this.stats.active && this.stats.afterRender()
  }

  tick = () => {
    requestAnimationFrame( this.tick )
    this.update()
  }

  destroy() {
    /**Clear Event Emitter*/
    this.sizes.off(EVT.RESIZE)
    // this.time.off(EVT.TICK)

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
