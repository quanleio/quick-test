import * as THREE from 'three'
import Experience from '../Experience'
import gsap from "gsap"
import Primitives from './Primitives';

export default class CameraPath {
  constructor(_primitives) {
    this.experience = new Experience()
    this.scene = this.experience.scene
    this.camera = this.experience.camera.instance
    this.controls = this.experience.camera.controls
    this.primitives = _primitives

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
    this.index = 0
    this.loopTime = 10
    this.pathProgress = 0
    this.animating = false
    this.isGoingUp = false
    this.isGoingDown = false

    this.makePath()
    this.transformCamera()
    this.setCameraTarget()

    window.addEventListener('wheel', this.onScrollHandler, false)
  }
  makePath = () => {
    this.totalPoints.push(new THREE.Vector3(-8, 0, 15))
    for (let i = this.count; i >=0; i--) {
      let r = (i * Math.PI * 3) / this.count
      this.totalPoints.push(new THREE.Vector3(Math.sin(r)*8, 0, i-95))
    }
    const path = new THREE.CatmullRomCurve3(this.totalPoints)
    const material = new THREE.MeshBasicMaterial( {
      color: 0x000000,//0x007f7f,
      wireframe: true,
      transparent: true,
      opacity: .1
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
      x: -8,
      y: 2,
      z: 15,
      ease: "power1.easeInOut",
      onUpdate: () => {
        this.camera.updateProjectionMatrix()
        this.controls.target.copy(this.camera.position)
        this.controls.update()
      },
      onComplete: () => {
        this.controls.enabled = false
      }
    })
  }
  setCameraTarget = ()=> {
    this.cameraTarget = new THREE.Object3D()
    this.lookTarget = new THREE.Object3D()

    for(let i=0; i<this.totalPoints.length; i+=15) {
      const vec = this.totalPoints[i]

      const targetGroup = this.primitives.makeClone()
      targetGroup.name = 'targetGroups_'+i
      const xFactor = THREE.MathUtils.randFloat(-8, 8)
      targetGroup.position.set(vec.x, -10, vec.z)
      this.scene.add(targetGroup)
      this.targetGroups.push(targetGroup)
    }
  }
  onScrollHandler = (event) => {
    event.preventDefault()

    if (this.animating) return

    if (event.deltaY < 0) {
      this.animating = true

      if(this.index < this.targetGroups.length-1) {
        this.index++
        this.isGoingUp = true
      }
      console.log('scrolling up: ', this.index);

      // const targetPos = this.targetGroups[this.index].position
      // this.controls.target.set(targetPos.x, targetPos.y, targetPos.z+2)

      gsap.to(this, {
        pathProgress: this.loopTime * (this.index * 15 / this.totalPoints.length) - 0.1,
        duration: 2.2,
        onUpdate: () => {
          this.updateCameraAlongPath()
          this.controls.target.copy(this.camera.position)
          this.controls.update()
        },
        onComplete: () => {
          this.animating = false
        }
      })
      this.animateTargetGroup(this.targetGroups[this.index])
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
      // this.controls.target.set(targetPos.x, targetPos.y+1, targetPos.z)

      gsap.to(this, {
        pathProgress: this.loopTime * (this.index * 15 / this.totalPoints.length) - 0.1,
        duration: 2.2,
        // ease: "power1.easeInOut",
        onUpdate: () => {
          this.updateCameraAlongPath()
        },
        onComplete: () => {
          this.animating = false
        }
      })
    }
  }
  animateTargetGroup = (group) => {
    this.primitives.animate(group)
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

    this.camera.position.set(pos.x, pos.y+2, pos.z)
    this.cameraTarget.position.set(pos2.x, pos2.y+2, pos2.z)
    this.lookTarget.position.set(pos3.x, pos3.y+1, pos3.z)
    this.camera.lookAt(this.cameraTarget.position)
  }
  update = () => {}
}
