import * as THREE from 'three'
import Experience from '../Experience'
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Box from './components/Box';
import Torus from './components/Torus';
import Cone from './components/Cone';
import Cylinder from './components/Cylinder';
import {map, radians} from '../../utils/utils';

export default class CameraPath {
  constructor() {
    this.experience = new Experience()
    this.scene = this.experience.scene
    this.camera = this.experience.camera.instance
    this.controls = this.experience.camera.controls
    this.sizes = this.experience.sizes

    this.clock = new THREE.Clock()
    this.count = 100
    this.totalPoints = []
    this.params = {
      pathSegments: 512,
      radius: 0.05,
      radiusSegments: 8,
      closed: false,
      scale: 10,
    }
    this.targetGroups = []
    this.temp = []
    this.geometries = [new Box(), new Torus(), new Cone(), new Cylinder()]
    this.index = 0

    this.direction = new THREE.Vector3()
    this.binormal = new THREE.Vector3()
    this.normal = new THREE.Vector3()
    this.lookAt = new THREE.Vector3()

    this.loopTime = 5
    this.pathProgress = 0
    this.currentPathPosition = new THREE.Vector3()

    this.makePath()
    this.initControl()
    this.makeCameraTarget()

    // this.onCameraControl()

    this.supportOffset = window.pageYOffset !== undefined
    this.lastKnownPos = 0
    this.currYPos = null
    window.addEventListener('wheel', this.onScrollHandler, false)

    this.animating = false
    this.isGoingUp = false
    this.isGoingDown = false
  }
  makePath = () => {
    for (let i = this.count; i >=0; i--) {
      let r = (i * Math.PI * 3) / this.count
      this.totalPoints.push(new THREE.Vector3(Math.sin(r)*10, 0, i-95))
    }
    const path = new THREE.CatmullRomCurve3(this.totalPoints)
    const geometry = new THREE.TubeGeometry( path, this.params.pathSegments, this.params.radius, this.params.radiusSegments, this.params.closed );
    const material = new THREE.MeshBasicMaterial( { color: 0xfff700, wireframe: true } );
    this.tube = new THREE.Mesh( geometry, material );
    this.scene.add( this.tube ); // hide it

    for(let i=0; i<this.totalPoints.length; i++) {
      const vec = this.totalPoints[i]

      const point = new THREE.Mesh(new THREE.IcosahedronGeometry(.1, 0), new THREE.MeshNormalMaterial())
      point.position.copy(vec)
      // this.scene.add(point) // hide it
    }
  }
  initControl = () => {
    gsap.registerPlugin(ScrollTrigger)

    // set not render immediately and reset trigger at the first time.
    ScrollTrigger.defaults({ immediateRender: false })
    ScrollTrigger.clearScrollMemory();
    window.history.scrollRestoration = "manual";

    this.camera_timeline = gsap.timeline({
      scrollTrigger: {
        trigger: ".section-1",
        start: "top top",
        endTrigger: ".section-7",
        end: "bottom bottom",
        markers: true,
        scrub: .1,
        once: true
      }
    })
  }
  makeCameraTarget = ()=> {
    this.cameraTarget = new THREE.Object3D()
    this.lookTarget = new THREE.Object3D()

    //
    const material = new THREE.MeshBasicMaterial({
      transparent: true,
      opacity: 1,
      color: 'red',
      side:THREE.DoubleSide,
    })

    for(let i=0; i<this.totalPoints.length; i+=15) {
      const vec = this.totalPoints[i]
      const group = new THREE.Object3D()
      group.name = 'Index_'+i
      group.position.copy(vec)
      this.scene.add(group)
      this.targetGroups.push(group)

      const geo = this.getRandomGeometry()
      const mesh = this.getMesh(geo.geometry, material)
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
    if (this.animating) return
    this.controls.enabled = false

    if (event.deltaY < 0) {
      this.animating = true

      if(this.index < this.targetGroups.length-1) {
        this.index++
        this.isGoingUp = true
      }
      console.log('scrolling up: ', this.index);
      const targetPos = this.targetGroups[this.index].position
      this.controls.target.set(targetPos.x, targetPos.y + 1, targetPos.z)

      gsap.to(this, {
        pathProgress: this.loopTime * (this.index * 15 / this.totalPoints.length) - 0.1,
        duration: 1.6,
        onUpdate: () => {
          this.updateCameraAlongPath()
        },
        onComplete: () => {
          this.animating = false
          this.controls.enabled = true
        }
      })

      // let start = this.targetGroups[this.index].position
      // gsap.to(this.camera.position, {
      //   duration: 1.6,
      //   x: start.x,
      //   y: start.y+1,
      //   z: start.z+4,
      //   ease: "power1.easeInOut",
      //   onUpdate: () => {
      //     this.controls.target.set(start.x, start.y+1, start.z)
      //     this.controls.update()
      //   },
      //   onComplete: () => {
      //     this.animating = false
      //     console.log('onComplete')
      //     //this.animateGroupMesh(this.targetGroups[this.index])
      //   }
      // })
      this.animateGroupMesh(this.targetGroups[this.index])
    }
    // else if (event.deltaY > 0)  {
    //   this.animating = true
    //   if(this.index > 0) {
    //     this.index--
    //     this.isGoingDown = true
    //   }
    //   console.log('scrolling down: ', this.index);
    //
    //   let start = this.targetGroups[this.index].position
    //   gsap.to(this.camera.position, {
    //     duration: 1.6,
    //     x: start.x,
    //     y: start.y+1,
    //     z: start.z+4,
    //     ease: "power1.easeInOut",
    //     onUpdate: () => {
    //       // don't update controls!
    //       // this.controls.target.set(start.x, start.y+1, start.z)
    //       // this.controls.update()
    //     },
    //     onComplete: () => {
    //       this.animating = false
    //     }
    //   })
    // }

  }
  onCameraControl = () => {
    for(let i=0; i<this.targetGroups.length; i++) {
      let group = this.targetGroups[i]
      this.camera_timeline
      .to(this.camera.position, {
        x: group.position.x,
        y: group.position.y+1,
        z: group.position.z,
        onUpdate: () => {
          // this.controls.target.copy( group.position )
          this.controls.target.set(group.position.x, group.position.y+1, group.position.z)
          this.controls.update()
        },
        onComplete:() => {
          if (i===6) {
            console.log('onComplete')
            this.camera_timeline.to("#experience", { opacity: 0 }, "simultaneously")
          }
        }
      })
    }
  }
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

    const t = (time % this.loopTime) / this.loopTime // 0 ~ 1
    const t2 = ((time + 0.1)% this.loopTime) / this.loopTime
    const t3 = ((time + 0.101)% this.loopTime) / this.loopTime

    const pos = this.tube.geometry.parameters.path.getPointAt(t) //time
    const pos2 = this.tube.geometry.parameters.path.getPointAt(t2)
    const pos3 = this.tube.geometry.parameters.path.getPointAt(t3)

    this.camera.position.set(pos.x, pos.y +1, pos.z)
    this.cameraTarget.position.set(pos2.x, pos2.y +1, pos2.z)
    this.lookTarget.position.set(pos3.x, pos3.y +3, pos3.z)
    this.camera.lookAt(this.cameraTarget.position)

    // this.currentPathPosition.copy(pos)
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
