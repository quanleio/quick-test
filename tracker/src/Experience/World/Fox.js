import * as THREE from "three"
import Experience from "../Experience.js"

export default class Fox {
  constructor() {
    this.experience = new Experience()
    this.scene = this.experience.scene
    this.resources = this.experience.resources
    this.time = this.experience.time
    this.debug = this.experience.debug

    // Debug
    if (this.debug.active) {
      this.debugFolder = this.debug.ui.addFolder("fox")
    }

    // Resource
    this.resource = this.resources.items.foxModel

    this.setModel()
    this.setMaterial()
    this.setAnimation()
  }

  setModel() {
    this.model = this.resource.scene
    this.model.scale.set(0.05, 0.05, 0.05)
    this.model.position.y -= 1.5
    this.scene.add(this.model)
  }

  setMaterial() {
    this.material = new THREE.MeshMatcapMaterial({
      matcap: this.resources.items.testMatcap,
      color: new THREE.Color(0xd5bb10)
    })

    this.model.traverse(child => {
      if(child.material) child.material = this.material
    })
  }

  setAnimation() {
    this.animation = {}

    // Mixer
    this.animation.mixer = new THREE.AnimationMixer(this.model)

    // Actions
    this.animation.actions = {}

    this.animation.actions.run = this.animation.mixer.clipAction(this.resource.animations[0])
    this.animation.actions.survey = this.animation.mixer.clipAction(this.resource.animations[1])
    this.animation.actions.walk = this.animation.mixer.clipAction(this.resource.animations[2])

    this.animation.actions.current = this.animation.actions.run
    this.animation.actions.current.play()

    // Play the action
    this.animation.play = (name) => {
      const newAction = this.animation.actions[name]
      const oldAction = this.animation.actions.current

      newAction.reset()
      newAction.play()
      newAction.crossFadeFrom(oldAction, 1)

      this.animation.actions.current = newAction
    }

    // Debug
    if (this.debug.active) {
      const debugObject = {
        playIdle: () => {
          this.animation.play("run")
        },
        playWalking: () => {
          this.animation.play("survey")
        },
        playRunning: () => {
          this.animation.play("walk")
        },
      }
      this.debugFolder.add(debugObject, "playIdle")
      this.debugFolder.add(debugObject, "playWalking")
      this.debugFolder.add(debugObject, "playRunning")
    }
  }

  update() {
    this.animation.mixer.update(this.time.delta * 0.001)
  }
}
