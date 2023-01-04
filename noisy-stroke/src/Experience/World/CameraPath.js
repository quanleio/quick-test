import * as THREE from 'three'
import Experience from '../Experience'
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import Box from './components/Box'
import Torus from './components/Torus'
import Cone from './components/Cone'
import Cylinder from './components/Cylinder'
import {map, radians} from '../../utils/utils'

export default class CameraPath {
  constructor(_material) {
    this.experience = new Experience()
    this.scene = this.experience.scene
    this.camera = this.experience.camera.instance
    this.controls = this.experience.camera.controls
    this.resources = this.experience.resources
    this.noiseMaterial = _material

    this.count = 100
    this.totalPoints = []
    this.params = {
      pathSegments: 512,
      radius: 3,
      radiusSegments: 20,
      closed: false,
      scale: 20,
    }
    this.targetGroups = []
    this.geometries = [new Box(), new Torus(), new Cone(), new Cylinder()]
    this.index = 0
    this.loopTime = 20
    this.pathProgress = 0
    this.animating = false
    this.isGoingUp = false
    this.isGoingDown = false

    this.makePath()
    this.transformCamera()
    this.makeCameraTarget()

    window.addEventListener('wheel', this.onScrollHandler, false)
  }
  makePath = () => {
    this.totalPoints.push(new THREE.Vector3(-10, 0, 15))
    for (let i = this.count; i >=0; i--) {
      let r = (i * Math.PI * 3) / this.count
      this.totalPoints.push(new THREE.Vector3(Math.sin(r)*10, 0, i-95))
    }
    const path = new THREE.CatmullRomCurve3(this.totalPoints)
    const material = new THREE.MeshBasicMaterial( {
      color: 0x000000,//0x007f7f,
      wireframe: true,
      transparent: true,
      opacity: .3
    })
    const geometry = new THREE.TubeGeometry( path, this.params.pathSegments, this.params.radius, this.params.radiusSegments, this.params.closed )
    this.tube = new THREE.Mesh( geometry, material )
    this.tube.position.set(0, -1.8, 0)
    this.scene.add( this.tube )

    /*for(let i=0; i<this.totalPoints.length; i++) {
      const vec = this.totalPoints[i]
      const point = new THREE.Mesh(new THREE.IcosahedronGeometry(.1, 0), new THREE.MeshNormalMaterial())
      point.position.copy(vec)
      this.scene.add(point) // hide it
    }*/
  }
  transformCamera = () => {
    gsap.to(this.camera.position, {
      duration: 1.6,
      x: -9.3,
      y: 1.8,
      z: 15,
      ease: "power1.easeInOut",
      onUpdate: () => {
        this.camera.updateProjectionMatrix()
        this.controls.update()
      },
      onComplete: () => {
        this.controls.enabled = false
      }
    })
  }
  makeCameraTarget = ()=> {
    this.cameraTarget = new THREE.Object3D()
    this.lookTarget = new THREE.Object3D()

    for(let i=0; i<this.totalPoints.length; i+=15) {
      const vec = this.totalPoints[i]
      const group = new THREE.Object3D()
      group.name = 'Index_'+i
      group.position.copy(vec)
      this.scene.add(group)
      this.targetGroups.push(group)

      // add random mesh into group
      const geo = this.getRandomGeometry()
      const mesh = this.getMesh(geo.geometry, this.noiseMaterial)
      mesh.position.y = -10
      mesh.scale.setScalar(0)
      mesh.rotation.set(geo.rotationX, geo.rotationY, geo.rotationZ)

      mesh.initialRotation = {
        x: mesh.rotation.x,
        y: mesh.rotation.y,
        z: mesh.rotation.z,
      }
      group.add(mesh)
    }
  }
  onScrollHandler = (event) => {
    event.preventDefault()

    if (this.animating) return
    // this.controls.enabled = false

    if (event.deltaY < 0) {
      this.animating = true

      if(this.index < this.targetGroups.length-1) {
        this.index++
        this.isGoingUp = true
      }
      console.log('scrolling up: ', this.index);
      // const targetPos = this.targetGroups[this.index].position
      // this.controls.target.set(targetPos.x, targetPos.y + 1, targetPos.z)

      gsap.to(this, {
        pathProgress: this.loopTime * (this.index * 15 / this.totalPoints.length) - 0.1,
        duration: 2.2,
        ease: "power1.easeInOut",
        onUpdate: () => {
          this.updateCameraAlongPath()
          const targetPos = this.targetGroups[this.index].position
          this.controls.target.set(targetPos.x, targetPos.y + 1.8, targetPos.z)
          this.controls.update()
        },
        onComplete: () => {
          this.animating = false
        }
      })
      this.animateGroupMesh(this.targetGroups[this.index])
    }
    else if (event.deltaY > 0)  {
      this.animating = true
      if(this.index > 0) {
        this.index--
        this.isGoingDown = true
      }
      console.log('scrolling down: ', this.index)

      // don't update controls!
      // const targetPos = this.targetGroups[this.index].position
      // this.controls.target.set(targetPos.x, targetPos.y + 1, targetPos.z)

      gsap.to(this, {
        pathProgress: this.loopTime * (this.index * 15 / this.totalPoints.length) - 0.1,
        duration: 2.2,
        ease: "power1.easeInOut",
        onUpdate: () => {
          this.updateCameraAlongPath()
        },
        onComplete: () => {
          this.animating = false
        }
      })
    }
  }
  /**
   * BACKUP
   * @param event
   */
  /*onScrollHandler = (event) => {
    if (this.animating) return
    this.controls.enabled = false

    if (event.deltaY < 0) {
      this.animating = true

      if(this.index < this.targetGroups.length-1) {
        this.index++
        this.isGoingUp = true
      }
      console.log('scrolling up: ', this.index);

      let start = this.targetGroups[this.index].position
      gsap.to(this.camera.position, {
        duration: 1.6,
        x: start.x,
        y: start.y+1,
        z: start.z+4,
        ease: "power1.easeInOut",
        onUpdate: () => {
          this.controls.target.set(start.x, start.y+1, start.z)
          this.controls.update()
        },
        onComplete: () => {
          this.animating = false
          console.log('onComplete')
          //this.animateGroupMesh(this.targetGroups[this.index])
        }
      })
      this.animateGroupMesh(this.targetGroups[this.index])
    }
    else if (event.deltaY > 0)  {
      this.animating = true
      if(this.index > 0) {
        this.index--
        this.isGoingDown = true
      }
      console.log('scrolling down: ', this.index);

      let start = this.targetGroups[this.index].position
      gsap.to(this.camera.position, {
        duration: 1.6,
        x: start.x,
        y: start.y+1,
        z: start.z+4,
        ease: "power1.easeInOut",
        onUpdate: () => {
          // don't update controls!
          // this.controls.target.set(start.x, start.y+1, start.z)
          // this.controls.update()
        },
        onComplete: () => {
          this.animating = false
        }
      })
    }
  }*/
  animateGroupMesh = (group) => {
    const tl = gsap.timeline()
    const mesh = group.children[0]

    tl.to(mesh.position, {
      duration: 1.5,
      y: 1,
      ease: "back.inOut(1.7)"
    })
    .to(mesh.scale, {
      duration: 1.0,
      x: 1.2,
      y: 1.2,
      z: 1.2,
      ease: "Expo.easeOut"
    })
    gsap.to(mesh.rotation, {
      duration: 2.2,
      x: map(mesh.position.y, -1, 1, radians(45), mesh.initialRotation.x),
      y: map(mesh.position.y, -1, 1, radians(-90), mesh.initialRotation.y),
      z: map(mesh.position.y, -1, 1, radians(90), mesh.initialRotation.z),
      ease: "back.inOut(0.7)",
    })
  }
  updateCameraAlongPath = () => {
    const time = this.pathProgress // 0 ~ this.loopTime
    // const time = this.clock.getElapsedTime()

    const t = Math.abs((time % this.loopTime) / this.loopTime) // 0 ~ 1
    const t2 = Math.abs(((time + 0.1)% this.loopTime) / this.loopTime)
    const t3 = Math.abs(((time + 0.101)% this.loopTime) / this.loopTime)

    const pos = this.tube.geometry.parameters.path.getPointAt(t)
    const pos2 = this.tube.geometry.parameters.path.getPointAt(t2)
    const pos3 = this.tube.geometry.parameters.path.getPointAt(t3)

    this.camera.position.set(pos.x, pos.y+1.8, pos.z)
    this.cameraTarget.position.set(pos2.x, pos2.y+1.8, pos2.z)
    this.lookTarget.position.set(pos3.x, pos3.y+1.8, pos3.z)
    this.camera.lookAt(this.cameraTarget.position)
  }
  getRandomGeometry = () => {
    return this.geometries[Math.floor(Math.random() * Math.floor(this.geometries.length))]
  }
  getMesh = (geometry, material) => {
    const mesh = new THREE.Mesh(geometry, material)
    mesh.castShadow = mesh.receiveShadow = true

    return mesh
  }
  update = () => {
    // this.updateCameraAlongPath()
  }
}
