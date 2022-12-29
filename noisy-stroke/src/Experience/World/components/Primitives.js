import * as THREE from 'three'
import { gsap } from 'gsap'
import Experience from '../../Experience'
import Torus from './Torus';
import Cone from './Cone';
import Box from './Box';
import Cylinder from './Cylinder';
import { map, radians } from '../../../utils/utils';

export default class Primitives {
  constructor(_material) {
    this.experience = new Experience()
    this.scene = this.experience.scene
    this.clock = new THREE.Clock()
    this.noiseMaterial = _material

    this.geometries = [new Box(), new Torus(), new Cone(), new Cylinder()]
    this.isCompleted = false
    this.count = 5
    this.meshes = []

    this.setObjects()
    this.animate()
    // window.addEventListener(EVT.CAMERA_ANIMATE_COMPLETED, () => {
    //   this.animate()
    // })
  }
  getMesh = (geometry, material) => {
    const mesh = new THREE.Mesh(geometry, material)
    mesh.castShadow = mesh.receiveShadow = true

    return mesh
  }
  setObjects = () => {
    this.groupMesh = new THREE.Object3D()
    this.groupMesh.position.set(0, -50, 0)
    // this.groupMesh.scale.setScalar(2) // test
    this.scene.add(this.groupMesh)

    for(let i=0; i<this.count; i++) {
      const geo = this.geometries[Math.floor(Math.random() * 3 + 1)]
      const mesh = this.getMesh(geo.geometry, this.noiseMaterial.clone())
      mesh.speed = Math.random() / 2

      /*let xPos = THREE.MathUtils.randFloat(-1, 1);
      let yPos = THREE.MathUtils.randFloat(-50, -10);
      let zPos = THREE.MathUtils.randFloat(-1, 1);*/

      let xPos = THREE.MathUtils.randFloat(-2, 2);
      let yPos = THREE.MathUtils.randFloat(-1, 1);
      let zPos = THREE.MathUtils.randFloat(-1, 1);
      mesh.position.set(xPos, yPos, zPos)

      const scaleFactor = THREE.MathUtils.randFloat(1, 3.5)
      mesh.scale.setScalar(scaleFactor)

      mesh.rotation.set(geo.rotationX, geo.rotationY, geo.rotationZ)

      mesh.initialRotation = {
        x: mesh.rotation.x,
        y: mesh.rotation.y,
        z: mesh.rotation.z,
      }
      // this.scene.add(mesh)
      this.groupMesh.add(mesh)
      this.meshes.push(mesh)
    }
  }
  animate = () => {
    const tl = gsap.timeline()
    /*tl.to(this.sphere.position, {
      duration: 2.,
      y: 0,
      ease: "back.inOut(0.7)",
      onComplete: () => {
        this.isCompleted = true
      }
    })*/

    tl.to(this.groupMesh.position, {
      duration: 1.8,
      y: 0,
      ease: "back.inOut(0.7)",
      onComplete: () => {
        this.isCompleted = true
      }
    })
    for(let i=0; i<this.count; i++) {
      let mesh = this.meshes[i]

      gsap.to(mesh.rotation, {
        duration: 3.,
        x: map(mesh.position.y, -1, 1, radians(45), mesh.initialRotation.x),
        y: map(mesh.position.y, -1, 1, radians(-90), mesh.initialRotation.y),
        z: map(mesh.position.y, -1, 1, radians(90), mesh.initialRotation.z),
        ease: "back.inOut(0.7)",
      })
    }

    /*for(let i=0; i<this.count; i++){
      let mesh = this.meshes[i]
      const scaleFactor = THREE.MathUtils.randFloat(0.5, 3.5)

      gsap.to(mesh.position, {
        duration: 1.8,
        x: THREE.MathUtils.randFloat(-2, 2),
        y: THREE.MathUtils.randFloat(-1, 1),
        ease: "back.inOut(0.7)",
      })

      gsap.to(mesh.scale, {
        duration: 1.8,
        x: scaleFactor,
        y: scaleFactor,
        z: scaleFactor,
        ease: "Expo.easeOut"
      })

      gsap.to(mesh.rotation, {
        duration: .5,
        x: map(mesh.position.y, -1, 1, radians(45), mesh.initialRotation.x),
        y: map(mesh.position.y, -1, 1, radians(-90), mesh.initialRotation.y),
        z: map(mesh.position.y, -1, 1, radians(90), mesh.initialRotation.z),
        ease: "Expo.easeOut",
      })
    }

    // need to change to better option
    setTimeout(() => {
      this.isCompleted = true
    }, 2000)*/

  }
  update = () => {
    /*this.noiseMaterial.uniforms.uTime.value = performance.now() / 1500

    if (this.isCompleted) {
      let val = this.noiseMaterial.uniforms.uProgress.value

      if (val >= 0 && val < 1.0) {
        this.noiseMaterial.uniforms.uProgress.value = this.clock.getElapsedTime() * 0.2
      }
    }*/

    for(let i=0; i<this.meshes.length; i++) {
      let mesh = this.meshes[i]

      mesh.material.uniforms.uTime.value = performance.now() / 1000
      let val = mesh.material.uniforms.uProgress.value
      if (this.isCompleted) {
        if (val >= 0 && val < 1.0) {
          // mesh.material.uniforms.uProgress.value = this.clock.getElapsedTime() * 0.2
          mesh.material.uniforms.uProgress.value = this.clock.getElapsedTime() * mesh.speed // random speed for each mesh
        }
      }
    }
  }
}
