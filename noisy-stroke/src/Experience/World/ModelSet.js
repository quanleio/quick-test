import * as THREE from 'three'
import { gsap } from 'gsap'
import Experience from '../Experience';
import {randFloat} from 'three/src/math/MathUtils';
import {map, radians} from '../../utils/utils';

export default class ModelSet {
  constructor(_material) {
    this.experience = new Experience()
    this.scene = this.experience.scene
    this.resources = this.experience.resources
    this.noiseMaterial = _material.clone() // >> clone?
    this.clock = new THREE.Clock()

    this.models = []
    this.params = {
      count: 2,
      targetGroupY: -10,
      isRunning: false
    }

    this.setModels()
  }
  setModels = () => {
    this.groupModel = new THREE.Object3D()
    this.groupModel.name = 'Models'
    // this.groupModel.position.y = this.params.targetGroupY

    // fox
    const fox = this.resources.items.foxModel.scene
    fox.traverse(child => {
      if (child.material) {
        child.material = this.noiseMaterial
      }
    })

    for(let i=0; i<this.params.count; i++) {
      const model = fox.clone()
      model.name = 'model_'+i
      let xPos = THREE.MathUtils.randFloat(-1, 2);
      let yPos = THREE.MathUtils.randFloat(-1, 1);
      let zPos = THREE.MathUtils.randFloat(-3, 1);
      model.position.set(xPos, yPos, zPos)
      model.rotation.set(0, 0, 0)
      model.scale.setScalar(0)

      model.userData = {
        initialRotation: {
          x: model.rotation.x,
          y: model.rotation.y,
          z: model.rotation.z,
        },
        isCompleted: false,
        speed: Math.random() + randFloat(500, 1000),
      }

      this.groupModel.add(model)
      this.models.push(model)
    }
    // console.log(this.models, this.groupModel.children)

    // face
    /*this.face = this.resources.items.oldFace.scene
    this.face.scale.setScalar(3)
    this.face.position.set(0, 0.5, 0)
    this.face.receiveShadow = this.face.castShadow = true

    this.face.traverse(child => {
      if (child.material) {
        child.material = this.noiseMaterial
      }
      if(child.geometry) {
        child.geometry.center()
      }
    })*/
  }
  makeClone = () => {
    return this.groupModel.clone()
  }
  show = (_group) => {
    console.log('show: ', _group)
    const tl = gsap.timeline()

    tl.to(_group.position, {
      duration: 2.5,
      y: 2.5,
      ease: "back.inOut(0.7)",
    })
    for(let i=0; i<_group.children.length; i++) {
      let mesh = _group.children[i]

      gsap.to(mesh.position, {
        duration: 2.0,
        y: THREE.MathUtils.randFloat(-2, 2),
        ease: "back.inOut(4)",
        onComplete: () => mesh.userData.isCompleted = true
      })
      const scaleFactor = THREE.MathUtils.randFloat(0.0125, 0.05)
      gsap.to(mesh.scale, {
        duration: 2.0,
        x: scaleFactor,
        y: scaleFactor,
        z: scaleFactor,
        ease: "Expo.easeOut"
      })
      gsap.to(mesh.rotation, {
        duration: 3.5,
        x: Math.PI/180 * THREE.MathUtils.randFloat(-10, 45),
        y: Math.PI/180 * THREE.MathUtils.randFloat(-10, -45),
        z: 0,
        ease: "back.inOut(0.7)",
      })

      this.params.isRunning = true
    }
  }
  update = () => {
    /*let val = this.noiseMaterial.uniforms.uProgress.value

    if (val >= 0 && val < 1.0) {
      this.noiseMaterial.uniforms.uProgress.value = this.clock.getElapsedTime() * 0.2
    }*/
  }
}
