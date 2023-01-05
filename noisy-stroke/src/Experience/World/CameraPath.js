import * as THREE from 'three'
import Experience from '../Experience'
import gsap from "gsap"

export default class CameraPath {
  constructor(_primitives) {
    this.experience = new Experience()
    this.scene = this.experience.scene
    this.camera = this.experience.camera.instance
    this.controls = this.experience.camera.controls
    this.primitives = _primitives

    this.totalPoints = []
    this.targetGroups = []
    this.animating = false
    this.isGoingUp = false
    this.isGoingDown = false
    this.currentTargetGroup = null
    this.params = {
      count: 100,
      loopTime: 10,
      index: 1,
      pathProgress: 0,
      tube: {
        pathSegments: 512,
        radius: 3,
        radiusSegments: 20,
        closed: false,
        scale: 20,
      },
      cameraEndPoint: {
        x: 0,
        y: 2,
        z: 0,
      }
    }

    this.makePath()
    this.setCameraTarget()
    this.transformCamera()

    window.addEventListener('wheel', this.onScrollHandler, false)
  }
  makePath = () => {
    for (let i = this.params.count; i >=0; i--) {
      let r = (i * Math.PI * 2) / this.params.count
      this.totalPoints.push(new THREE.Vector3(Math.sin(r)*8, 0, i-100))
    }
    const path = new THREE.CatmullRomCurve3(this.totalPoints)
    const material = new THREE.MeshBasicMaterial( {
      color: 0x000000,//0x007f7f,
      wireframe: true,
      transparent: true,
      opacity: .1
    })
    const geometry = new THREE.TubeGeometry( path, this.params.tube.pathSegments, this.params.tube.radius, this.params.tube.radiusSegments, this.params.tube.closed )
    this.tube = new THREE.Mesh( geometry, material )
    this.tube.position.set(0, -2, 0)
    this.scene.add( this.tube )

    // hide this!
    /*for(let i=0; i<this.totalPoints.length; i++) {
      const vec = this.totalPoints[i]
      const point = new THREE.Mesh(new THREE.IcosahedronGeometry(.1, 0), new THREE.MeshNormalMaterial())
      point.position.copy(vec)
      this.scene.add(point)
    }*/
  }
  transformCamera = () => {
    gsap.to(this.camera.position, {
      duration: 1.6,
      x: this.params.cameraEndPoint.x,
      y: this.params.cameraEndPoint.y,
      z: this.params.cameraEndPoint.z,
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
    // show first target group
    this.primitives.show(this.currentTargetGroup)
  }
  setCameraTarget = ()=> {
    this.cameraTarget = new THREE.Object3D()
    this.lookTarget = new THREE.Object3D()

    // this.totalPoints = this.totalPoints.slice(15, this.totalPoints.length)
    // for(let i=0; i<this.totalPoints.length; i+=15) {
    for(let i=0; i<this.totalPoints.length; i+=15) {
    // for(let i=10; i<this.totalPoints.length; i+=15) { // go back in z-index to 10 unit
      const vec = this.totalPoints[i]

      const targetGroup = this.primitives.makeClone()
      targetGroup.name = 'targetGroups_'+i
      const xFactor = THREE.MathUtils.randFloat(-4, 4)
      targetGroup.position.x = vec.x+xFactor
      targetGroup.position.z = vec.z
      this.scene.add(targetGroup)
      this.targetGroups.push(targetGroup)
    }

    console.log(this.targetGroups)
    // init
    this.currentTargetGroup = this.targetGroups[this.params.index]
  }
  onScrollHandler = (event) => {
    // event.preventDefault()

    if (this.animating) return

    if (event.deltaY < 0) {
      this.animating = true

      if(this.params.index < this.targetGroups.length-1) {
        this.params.index++
        this.isGoingUp = true
      }
      console.log('scrolling up: ', this.params.index);

      // const targetPos = this.targetGroups[this.params.index].position
      // this.controls.target.set(targetPos.x, targetPos.y, targetPos.z+2)

      gsap.to(this.params, {
        pathProgress: this.params.loopTime * (this.params.index * 15 / this.totalPoints.length) - 1.0,
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
    else if (event.deltaY >=1 )  {
      console.log(event.deltaY)
      this.animating = true

      if(this.params.index > 0) {
        this.params.index--
        this.isGoingDown = true
      }
      // console.log('scrolling down: ', this.params.index)

      gsap.to(this.params, {
        pathProgress: this.params.loopTime * (this.params.index * 15 / this.totalPoints.length) - 1.0,
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
  }
  updateCameraAlongPath = () => {
    const time = this.params.pathProgress // 0 ~ this.params.loopTime
    // const time = this.clock.getElapsedTime()

    const t = Math.abs((time % this.params.loopTime) / this.params.loopTime) // 0 ~ 1
    const t2 = Math.abs(((time + 0.1)% this.params.loopTime) / this.params.loopTime)
    const t3 = Math.abs(((time + 0.101)% this.params.loopTime) / this.params.loopTime)

    const pos = this.tube.geometry.parameters.path.getPointAt(t)
    const pos2 = this.tube.geometry.parameters.path.getPointAt(t2)
    const pos3 = this.tube.geometry.parameters.path.getPointAt(t3)

    this.camera.position.set(pos.x, pos.y+2, pos.z)
    this.cameraTarget.position.set(pos2.x, pos2.y+2, pos2.z)
    this.lookTarget.position.set(pos3.x, pos3.y+1, pos3.z)
    this.camera.lookAt(this.cameraTarget.position)
  }
  update = () => {
    if(this.currentTargetGroup) {
      this.primitives.update(this.currentTargetGroup)
    }
  }
}
