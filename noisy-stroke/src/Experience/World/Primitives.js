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
    this.params = {
      targetGroupY: -10,
    }

    this.setObjects()
  }
  getMesh = (geometry, material) => {
    const mesh = new THREE.Mesh(geometry, material)
    mesh.castShadow = mesh.receiveShadow = true

    return mesh
  }
  setObjects = () => {
    this.groupMesh = new THREE.Object3D()
    this.groupMesh.position.y = this.params.targetGroupY
    for(let i=0; i<this.count; i++) {
      const geo = this.geometries[Math.floor(Math.random() * 3 + 1)]
      const mesh = this.getMesh(geo.geometry, this.noiseMaterial.clone())

      let xPos = THREE.MathUtils.randFloat(-2, 1);
      let yPos = THREE.MathUtils.randFloat(-1, 1);
      let zPos = THREE.MathUtils.randFloat(-3, 1);
      mesh.position.set(xPos, yPos, zPos)
      mesh.rotation.set(geo.rotationX, geo.rotationY, geo.rotationZ)
      mesh.scale.setScalar(0)

      mesh.userData = {
        initialRotation: {
          x: mesh.rotation.x,
          y: mesh.rotation.y,
          z: mesh.rotation.z,
        },
        speed: Math.random()/2,
        isCompleted: false
      }
      this.groupMesh.add(mesh)
      this.meshes.push(mesh)
    }
  }
  makeClone = () => {
    return this.groupMesh.clone()
  }
  show = (_group) => {
    const tl = gsap.timeline()

    tl.to(_group.position, {
      duration: 1.5,
      y: 2.5,
      ease: "back.inOut(0.7)",
    })
    for(let i=0; i<_group.children.length; i++) {
      let mesh = _group.children[i]

      gsap.to(mesh.position, {
        duration: 1.5,
        y: THREE.MathUtils.randFloat(-1, 2),
        ease: "back.inOut(0.7)",
        onComplete: () => {
          mesh.material.uniforms.uProgress.value = 0
          mesh.material.uniforms.uTime.value = 0
          mesh.material.uniforms.needsUpdate = true

          mesh.userData.isCompleted = true
        }
      })
      const scaleFactor = THREE.MathUtils.randFloat(.2, 0.8)
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
  hide = (_groups) => {
    const tl = gsap.timeline()

    for(let i=0; i<_groups.length; i++) {
      const group = _groups[i]

      tl.to(group.position, {
        duration: 1.2,
        y: -10,
        ease: "back.inOut(0.7)",
      })
      for(let i=0; i<group.children.length; i++) {
        let mesh = group.children[i]

        gsap.to(mesh.position, {
          duration: 1.5,
          y: THREE.MathUtils.randFloat(-1, 1),
          ease: "back.inOut(0.7)",
          onComplete: () => {
            mesh.userData.isCompleted = false

            mesh.material.uniforms.uProgress.value = 0
            mesh.material.uniforms.uTime.value = 0
            mesh.material.uniforms.needsUpdate = true
          }
        })
        gsap.to(mesh.scale, {
          duration: 1.5,
          x: 0,
          y: 0,
          z: 0,
          ease: "Expo.easeOut"
        })
        gsap.to(mesh.rotation, {
          duration: 3.,
          x: mesh.userData.initialRotation.x,
          y: mesh.userData.initialRotation.y,
          z: mesh.userData.initialRotation.z,
          ease: "back.inOut(0.7)",
        })
      }
    }
  }
  update = (_currentTargetGroup) => {
    /*for(let i=0; i<this.meshes.length; i++) {
      let mesh = this.meshes[i]

      mesh.material.uniforms.uTime.value = performance.now() / 1000
      let val = mesh.material.uniforms.uProgress.value

      if (this.isCompleted) {
        if (val >= 0 && val < 1.0) {
          mesh.material.uniforms.uProgress.value = this.clock.getElapsedTime() * mesh.speed // random speed for each mesh
        }
      } else mesh.material.uniforms.uProgress.value = 0
    }*/

    for(let i=0; i<_currentTargetGroup.children.length; i++) {
      const mesh = _currentTargetGroup.children[i]

      mesh.material.uniforms.uTime.value = performance.now() / 1000
      let val = mesh.material.uniforms.uProgress.value

      if (mesh.userData.isCompleted) {
        if (val >= 0 && val < 1.0) {
          mesh.material.uniforms.uProgress.value = this.clock.getElapsedTime() * mesh.userData.speed
        }
      }
    }


  }
}
