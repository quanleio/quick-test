import * as THREE from 'three'
import { gsap } from 'gsap'
import Experience from '../Experience'
import Torus from '../World/components/Torus'
import Cone from '../World/components/Cone';
import Box from '../World/components/Box';
import Cylinder from '../World/components/Cylinder';
import { map, radians } from '../../utils/utils';

export default class Primitives {
  constructor(_material) {
    this.experience = new Experience()
    this.controls = this.experience.camera.controls
    this.clock = new THREE.Clock()
    this.noiseMaterial = _material

    this.geometries = [new Box(), new Torus(), new Cone(), new Cylinder()]
    this.isCompleted = false
    this.count = 5
    this.meshes = []

    this.setObjects()
  }
  getMesh = (geometry, material) => {
    const mesh = new THREE.Mesh(geometry, material)
    mesh.castShadow = mesh.receiveShadow = true

    return mesh
  }
  setObjects = () => {
    this.groupMesh = new THREE.Object3D()
    for(let i=0; i<this.count; i++) {
      const geo = this.geometries[Math.floor(Math.random() * 3 + 1)]
      const mesh = this.getMesh(geo.geometry, this.noiseMaterial.clone())
      mesh.speed = Math.random() / 2

      let xPos = THREE.MathUtils.randFloat(-2, 1);
      let yPos = THREE.MathUtils.randFloat(-1, 1);
      let zPos = THREE.MathUtils.randFloat(-3, 1);
      mesh.position.set(xPos, yPos, zPos)
      mesh.rotation.set(geo.rotationX, geo.rotationY, geo.rotationZ)
      mesh.scale.setScalar(0)

      mesh.userData.initialRotation = {
        x: mesh.rotation.x,
        y: mesh.rotation.y,
        z: mesh.rotation.z,
      }
      this.groupMesh.add(mesh)
      this.meshes.push(mesh)
    }
  }
  makeClone = () => {
    return this.groupMesh.clone()
  }
  animate = (_group) => {
    const tl = gsap.timeline()

    tl.to(_group.position, {
      duration: 1.5,
      y: 2.5,
      ease: "back.inOut(0.7)",
      onComplete: () => {
        this.isCompleted = true
      }
    })
    for(let i=0; i<_group.children.length; i++) {
      let mesh = _group.children[i]

      gsap.to(mesh.position, {
        duration: 1.5,
        y: THREE.MathUtils.randFloat(-1, 2),
        ease: "back.inOut(0.7)",
        onComplete: () => {
          this.isCompleted = true
        }
      })
      const scaleFactor = THREE.MathUtils.randFloat(.2, 0.6)
      gsap.to(mesh.scale, {
        duration: 1.5,
        x: scaleFactor,
        y: scaleFactor,
        z: scaleFactor,
        ease: "Expo.easeOut"
      })
      gsap.to(mesh.rotation, {
        duration: 3.,
        x: map(mesh.position.y, -1, 1, radians(45), mesh.userData.initialRotation.x),
        y: map(mesh.position.y, -1, 1, radians(-90), mesh.userData.initialRotation.y),
        z: map(mesh.position.y, -1, 1, radians(90), mesh.userData.initialRotation.z),
        ease: "back.inOut(0.7)",
      })
    }
  }
  update = () => {
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
