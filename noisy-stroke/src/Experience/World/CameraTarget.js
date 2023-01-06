import * as THREE from 'three'
import { gsap } from 'gsap'
import Experience from '../Experience';
import Primitives from './Primitives';
import { EVT } from '../../utils/contains';
import ModelSet from './ModelSet';

export default class CameraTarget {
  constructor(totalPoints, noiseMaterial) {
    this.experience = new Experience()
    this.scene = this.experience.scene
    this.camera = this.experience.camera
    this.controls = this.camera.controls
    this.resources = this.experience.resources

    this.primitives = new Primitives(noiseMaterial)
    this.modelSet = new ModelSet(noiseMaterial)

    this.totalPoints = totalPoints
    this.targetGroups = []
    this.currentTargetGroup = null
    this.isGoingUp = false
    this.isGoingDown = false
    this.params = {
      count: 100,
      loopTime: 10,
      index: 1,
      pathProgress: 0,
      targetGroupY: -10,
    }

    this.setTargets()

    window.addEventListener(EVT.CAMERA_ANIMATE_COMPLETED, this.showFirstGroup, false)
    window.addEventListener(EVT.SCROLL_UP, this.onScrollUp, false)
    window.addEventListener(EVT.SCROLL_DOWN, this.onScrollDown, false)
  }
  /*setTargets = () => {
    for(let i=0; i<this.totalPoints.length; i+=15) {
      const vec = this.totalPoints[i]

      // 1 targetGroup: 5 random primitives + 2 models
      const targetGroup = new THREE.Object3D()
      this.primitiveGroup = this.getPrimitives()
      targetGroup.add(this.primitiveGroup)

      // const targetGroup = this.getPrimitives() // this is object3D
      this.modelGroup = this.getModels()
      // models.children.forEach(md => targetGroup.children.push(md))
      targetGroup.add(this.modelGroup)
      targetGroup.name = 'targetGroups_'+i

      const xFactor = THREE.MathUtils.randFloat(-4, 4)
      targetGroup.position.set(vec.x+xFactor, this.params.targetGroupY, vec.z)
      this.scene.add(targetGroup)
      this.targetGroups.push(targetGroup)
    }

    // init
    this.currentTargetGroup = this.targetGroups[this.params.index]
    // console.log(this.currentTargetGroup.children)
  }*/
  setTargets = () => {
    this.primitiveGroup = this.getPrimitives()
    this.primitiveGroup.position.z = -15

    this.modelGroup = this.getModels()
    this.modelGroup.position.z =-15

    for(let i=0; i<this.totalPoints.length; i+=15) {
      const vec = this.totalPoints[i]

      const targetGroup = new THREE.Object3D()
      targetGroup.children.push(this.primitiveGroup)
      targetGroup.children.push(this.modelGroup)

      targetGroup.name = 'targetGroups_'+i
      const xFactor = THREE.MathUtils.randFloat(-4, 4)
      targetGroup.position.set(vec.x+xFactor, this.params.targetGroupY, vec.z)
      this.scene.add(targetGroup)
      this.targetGroups.push(targetGroup)
    }

    // init
    this.currentTargetGroup = this.targetGroups[this.params.index]
    console.log('this.currentTargetGroup: ', this.currentTargetGroup)
  }
  /*setTargets = () => {
    this.primitiveGroup = this.getPrimitives()
    this.primitiveGroup.position.z = -15

    for(let i=0; i<this.totalPoints.length; i+=15) {
      const vec = this.totalPoints[i]

      const targetGroup = this.primitives.makeClone()
      targetGroup.name = 'targetGroups_'+i
      const xFactor = THREE.MathUtils.randFloat(-4, 4)
      targetGroup.position.set(vec.x+xFactor, this.params.targetGroupY, vec.z)
      this.scene.add(targetGroup)
      this.targetGroups.push(targetGroup)
    }

    // init
    this.currentTargetGroup = this.targetGroups[this.params.index]
  }*/
  getPrimitives = () => {
    return this.primitives.makeClone()
  }
  getModels = () => {
    return this.modelSet.makeClone()
  }
  onScrollUp = () => {
    if(this.params.index < this.targetGroups.length-1) {
      this.params.index++
      this.isGoingUp = true
    }
    console.log('scrolling up: ', this.params.index);

    gsap.to(this.params, {
      pathProgress: this.params.loopTime * (this.params.index * 15 / this.totalPoints.length) - 1.0,
      duration: 2.2,
      onUpdate: () => {
        this.camera.updateCameraAlongPath(this.params.pathProgress)
        this.controls.target.copy(this.camera.instance.position)
        this.controls.update()
      },
      onComplete: () => {
        this.camera.isScrolling = false
      }
    })

    // animate target groups
    this.currentTargetGroup = this.targetGroups[this.params.index]
    this.primitives.show(this.currentTargetGroup)

    let arr = []
    if (this.params.index > 0 && this.params.index < 6) {
      arr.push(this.targetGroups[this.params.index-1])
      arr.push(this.targetGroups[this.params.index+1])
      this.primitives.hide(arr)
    }
  }
  onScrollDown = () => {
    if(this.params.index > 0) {
      this.params.index--
      this.isGoingDown = true
    }
    console.log('scrolling down: ', this.params.index)

    gsap.to(this.params, {
      pathProgress: this.params.loopTime * (this.params.index * 15 / this.totalPoints.length) - 1.0,
      duration: 2.2,
      onUpdate: () => {
        this.camera.updateCameraAlongPath(this.params.pathProgress)
        this.controls.target.copy(this.camera.instance.position)
        this.controls.update()
      },
      onComplete: () => {
        this.camera.isScrolling = false
      }
    })

    // animate target groups
    this.currentTargetGroup = this.targetGroups[this.params.index]
    this.primitives.show( this.currentTargetGroup )

    let arr = []
    if (this.params.index > 0 && this.params.index < 6) {
      arr.push(this.targetGroups[this.params.index-1])
      arr.push(this.targetGroups[this.params.index+1])
      this.primitives.hide(arr)
    }
  }
  showFirstGroup = () => {
    // this.primitives.show(this.currentTargetGroup)
    this.primitives.show(this.primitiveGroup)
    this.modelSet.show(this.modelGroup)
  }
  update = () => {
    if(this.currentTargetGroup) {
      // this.primitives.update(this.currentTargetGroup)
      // this.primitives.update(this.primitiveGroup)
    }
  }
}
