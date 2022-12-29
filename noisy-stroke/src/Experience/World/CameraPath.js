import * as THREE from 'three'
import Experience from '../Experience'
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default class CameraPath {
  constructor() {
    this.experience = new Experience()
    this.scene = this.experience.scene
    this.camera = this.experience.camera.instance

    this.clock = new THREE.Clock()
    this.cameraPathPosition = 0.1*100
    this.count = 30
    this.points = []
    this.targets = []
    this.params = {
      pathSegments: 512,
      radius: 0.1/2,
      radiusSegments: 8,
      closed: false,
      scale: 10,
    }
    this._event = {
      y: 0,
      deltaY: 0
    }
    this.scrollY = 0;
    this.percentage = 0
    this.maxHeight = 1200

    this.makePath()
    this.addObject()
    // this.makeCameraTarget()
    // window.addEventListener('wheel', this.wheelHandler)

    this.animate()
  }
  addObject = ()=> {
    const geometry = new THREE.BoxGeometry();
    const material = new THREE.MeshNormalMaterial();
    this.box = new THREE.Mesh(geometry, material);
    this.box.scale.set(1.0, 1.0, 1.0);
    this.box.position.set(0.0, 0.0, 0.0);
    this.scene.add(this.box);
  }
  animate = () => {
    gsap.registerPlugin(ScrollTrigger)

    ScrollTrigger.defaults({
      immediateRender: false,
      ease: "power1.inOut"
    })
    let car_anim_tl = gsap.timeline({
      scrollTrigger: {
        trigger: ".section-one",
        start: "top top",
        endTrigger: ".section-five",
        end: "bottom bottom",
        markers: false,
        scrub: true,
      }
    });
    car_anim_tl
    .to(this.box.rotation, { y: 4.79 })
    .to(this.camera.position, { x: -0.1 })
    .to(this.box.rotation, { z: 1.6 })
    .to(this.box.rotation, { z: 0.02, y: 3.1 }, "simultaneously")
    .to(this.camera.position, { x: 0.16 }, "simultaneously")
    .to("#experience", { opacity: 0, scale: 0 }, "simultaneously");
  }
  makePath = () => {
    // const geo = new THREE.SphereGeometry(1/4, 32, 32)
    const geo = new THREE.CylinderGeometry(1/4, 1/4, 10, 32)
    const mat = new THREE.MeshBasicMaterial({ color: 0xe32b2b})

    /*for(let i=0; i<this.count; i++) {
      const point = new THREE.Mesh(geo, mat)

      let xPos = THREE.MathUtils.randFloat(-10, 10)
      let yPos = 0
      let zPos = THREE.MathUtils.randFloat(3, -10);
      point.position.set(xPos, yPos, zPos)

      this.scene.add(point)
      this.points.push(point.position)
    }*/
    // this.points.push(new THREE.Vector3(this.camera.position.x, 0, this.camera.position.z))
    for (let i = 0; i < this.count; i++) {
      let r = (i * Math.PI * 3) / this.count
      this.points.push(new THREE.Vector3(Math.sin(r) * 6, 0, i-24)) // move the start point forward the camera ( in case of 30)
    }
    const path = new THREE.CatmullRomCurve3(this.points)
    const geometry = new THREE.TubeGeometry( path, this.params.pathSegments, this.params.radius, this.params.radiusSegments, this.params.closed );
    const material = new THREE.MeshBasicMaterial( { color: 0xfff700 } );
    this.tube = new THREE.Mesh( geometry, material );
    this.scene.add( this.tube );

    // make sphere target
    const startPoint = new THREE.Mesh(geo, mat)
    startPoint.position.set(this.camera.position.x, 0, this.camera.position.z)
    this.scene.add(startPoint)
    this.targets.push(startPoint.position)
    for(let i=0; i<this.points.length; i+=5) {
      const vec = this.points[i]
      const point = new THREE.Mesh(geo, mat)
      point.position.copy(vec)
      this.scene.add(point)
      this.targets.push(point.position)
    }
  }
  makeCameraTarget = () => {
    const geometry1 = new THREE.BoxGeometry( 1, 1, 2 );
    const  material1 = new  THREE.MeshBasicMaterial({
      color:0x333333,
      side:THREE.DoubleSide,
    })

    this.cameraTarget = new THREE.Object3D();
    this.lookTarget = new THREE.Object3D();
    this.cameraTargetlook = new THREE.Mesh(geometry1,material1);
    // this.cameraTargetlook.position.copy(this.camera.position)
    this.scene.add(this.cameraTargetlook);
  }
  wheelHandler = (ev) => {
   /* const max = 25
    const min = 0
    const total = this.targets.length
    const speed = 0.001*/

    /*this.cameraPathPosition = this.cameraPathPosition + ev.deltaY * speed
    if (this.cameraPathPosition > max || this.cameraPathPosition < min) {
      if (this.cameraPathPosition > max) {
        this.cameraPathPosition = max
      }

      if (this.cameraPathPosition < min) {
        this.cameraPathPosition = min
      }
      return
    }
    const pointAt = this.cameraPathPosition / total
    this.updateCameraOnWheel(ev, pointAt)*/

    /*if (ev.deltaY < 0) {
      console.log('scrolling up: ', ev.deltaY * speed);
    }
    else if (ev.deltaY > 0) {
      console.log('scrolling down: ', ev.deltaY);
    }
    // console.log(this.targets)

    let evt = this._event;
    evt.deltaY = ev.deltaY || ev.deltaY * -1;
    evt.deltaY *= 0.5;

    scroll(ev);*/
  }
  /*scroll = (ev) => {
    let evt = this._event;
    // limit scroll top
    if ((evt.y + evt.deltaY) > 0 ) {
      evt.y = 0;
      // limit scroll bottom
    } else if ((-(evt.y + evt.deltaY)) >= this.maxHeight) {
      evt.y = -this.maxHeight;
    } else {
      evt.y += evt.deltaY;
    }
    this.scrollY = -evt.y
    console.log(this.scrollY)
  }
  updateCameraOnWheel = (ev, pointAt) => {
    const speed = 0.001
    let temp = ev.deltaY * 0.0007
    console.log(temp, pointAt)

    const time = this.clock.getElapsedTime(); //performance.now() * 0.002
    const looptime = 20;
    const t = (time % looptime)/ looptime
    const pos = this.tube.geometry.parameters.path.getPointAt(t);

    this.camera.position.set(pos.x, pos.y +4, pos.z);
    this.camera.lookAt(new THREE.Vector3(0, 0, 0))
  }*/
  updateCameraAlongPath = () => {
    const time = this.clock.getElapsedTime()
    const looptime = 20;
    const t = (time % looptime)/ looptime
    const t2 = ((time +0.1)% looptime) / looptime;
    const t3 = ((time +0.101)% looptime) / looptime;
    const pos = this.tube.geometry.parameters.path.getPointAt(t);
    const  pos2 = this.tube.geometry.parameters.path.getPointAt(t2);
    const  pos3 = this.tube.geometry.parameters.path.getPointAt(t3);
    this.camera.position.set(pos.x, pos.y +4, pos.z);

    this.cameraTarget.position.set(pos2.x, pos2.y +4, pos2.z);
    this.cameraTargetlook.position.set(pos2.x, pos2.y, pos2.z);
    this.lookTarget.position.set(pos3.x, pos3.y, pos3.z);

    this.camera.lookAt(this.cameraTarget.position);
    this.camera.lookAt(new THREE.Vector3(0, 0, 0))

    this.cameraTargetlook.lookAt(this.lookTarget.position);
    this.cameraTargetlook.rotateOnAxis( new THREE.Vector3(0,1,0), Math.PI * -0.5);
  }
  update = () => {
    // this.updateCameraAlongPath()
  }
}
