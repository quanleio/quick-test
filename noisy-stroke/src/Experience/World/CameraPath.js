import * as THREE from 'three'
import Experience from '../Experience'
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Box from './components/Box';
import Torus from './components/Torus';
import Cone from './components/Cone';
import Cylinder from './components/Cylinder';
import {RoundedBoxGeometry} from 'three/examples/jsm/geometries/RoundedBoxGeometry';

export default class CameraPath {
  constructor() {
    this.experience = new Experience()
    this.scene = this.experience.scene
    this.camera = this.experience.camera.instance

    this.clock = new THREE.Clock()
    this.cameraPathPosition = 0.1*100
    this.count = 10
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
    this.groups = []
    this.geometries = [new Box(), new Torus(), new Cone(), new Cylinder()]

    this.makePath()
    this.addObject()
    this.animate()
  }
  makePath = () => {
    const geo = new THREE.SphereGeometry(0.25, 32, 32)
    const mat = new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0})

    /*for (let i = 0; i < this.count; i++) {
      let r = (i * Math.PI * 3) / this.count
      this.points.push(new THREE.Vector3(Math.sin(r) * 6, 0, i-24)) // move the start point forward the camera ( in case of 30)
    }*/

    for (let i = this.count; i >=0; i--) {
      let r = (i * Math.PI * 3) / this.count
      this.points.push(new THREE.Vector3(Math.sin(r)*2, 0, i-5))
    }
    const path = new THREE.CatmullRomCurve3(this.points)
    const geometry = new THREE.TubeGeometry( path, this.params.pathSegments, this.params.radius, this.params.radiusSegments, this.params.closed );
    const material = new THREE.MeshBasicMaterial( { color: 0xfff700 } );
    this.tube = new THREE.Mesh( geometry, material );
    this.scene.add( this.tube );

    // make target points
    // const startPoint = new THREE.Mesh(geo, mat)
    // startPoint.position.set(this.camera.position.x, 0, this.camera.position.z)
    // this.scene.add(startPoint)
    // this.targets.push(startPoint.position)

    /*for (let i = this.points.length - 1; i >= 0; i -= 5) {
      const vec = this.points[i]
      const point = new THREE.Mesh(geo, mat)
      point.position.copy(vec)
      this.scene.add(point)
      this.targets.push(point.position)
    }*/
    for(let i=0; i<this.points.length; i+=2) {
      const vec = this.points[i]
      const point = new THREE.Mesh(geo, mat)
      point.position.copy(vec)
      this.scene.add(point)
      this.targets.push(point.position)
    }
  }
  getRandomGeometry = () => {
    return this.geometries[Math.floor(Math.random() * Math.floor(this.geometries.length))];
  }
  getMesh = (geometry, material) => {
    const mesh = new THREE.Mesh(geometry, material)
    mesh.castShadow = mesh.receiveShadow = true

    return mesh
  }
  addObject = ()=> {
    const material = new THREE.MeshNormalMaterial();

    console.log('targets: ', this.targets)
    /*for(let i=0; i<this.targets.length; i++) {
      const vec = this.targets[i]
      const group = new THREE.Object3D()
      group.position.copy(vec)
      this.scene.add(group)
      this.groups.push(group)

      const geo = this.getRandomGeometry()
      const mesh = this.getMesh(geo.geometry, material)
      group.add(mesh)
    }*/
    for(let i=0; i<this.targets.length; i++) {
      const vec = this.targets[i]
      const group = new THREE.Object3D()
      group.position.copy(vec)
      this.scene.add(group)
      this.groups.push(group)

      // const geo = this.getRandomGeometry()
      // const mesh = this.getMesh(geo.geometry, material)
      // group.add(mesh)
    }

    // index=0, z=5
    const boxGeo = new RoundedBoxGeometry(.7, .7, .7, 1, 0.1)
    const box = new THREE.Mesh(boxGeo, material)
    this.groups[0].add(box)

    // index=1, z=3
    const torusGeo = new THREE.TorusGeometry(0.35, 0.14, 32, 200)
    const torus = new THREE.Mesh(torusGeo, material)
    this.groups[1].add(torus)

    // index=2, z=1
    const coneGeo = new THREE.ConeGeometry(0.4, .6, 32)
    const cone = new THREE.Mesh(coneGeo, material)
    this.groups[2].add(cone)

    // index=3, z=-1
    const cylinderGeo = new THREE.CylinderGeometry(.3, .3, .6, 64)
    const cylinder = new THREE.Mesh(cylinderGeo, material)
    this.groups[3].add(cylinder)

    // index=4, z=-3
    const sphereGeo = new THREE.SphereGeometry(.3, 32, 32)
    const sphere = new THREE.Mesh(sphereGeo, material)
    this.groups[4].add(sphere)

    // index=5, z=-5
    const dodecGeo = new THREE.DodecahedronGeometry(.3, 0)
    const dodec = new THREE.Mesh(dodecGeo, material)
    this.groups[5].add(dodec)

  }
  animate = () => {
    let index=0
    const center = new THREE.Vector3(0, 0, 0)
    gsap.registerPlugin(ScrollTrigger)

    ScrollTrigger.defaults({
      immediateRender: true,
      ease: "power1.inOut"
    })

    let car_anim_tl = gsap.timeline({
      scrollTrigger: {
        trigger: ".section-one",
        start: "top top",
        endTrigger: ".section-seven",
        end: "bottom bottom",
        markers: false,
        scrub: 1,
      }
    });
    for(let i=0; i<this.groups.length; i++) {
      car_anim_tl
      .to(this.camera.position, {
        x: this.groups[i].position.x,
        y: this.groups[i].position.y+1,
        z: this.groups[i].position.z,
        onComplete:() => {
          console.log('moved: ', this.groups[i].position)
        }
      })
    }
    // car_anim_tl
    // .to(this.camera.position, {
    //   x: this.groups[index].position.x,
    //   z: this.groups[index].position.z,
    //   onUpdate: () => {
    //     // this.camera.lookAt(this.groups[index].position)
    //     // this.camera.updateProjectionMatrix()
    //   },
    //   onComplete:() => {
    //     console.log('moved: ', this.groups[index].position)
    //   }
    // })
    // .to(this.camera.position, {
    //   x: this.groups[index+1].position.x,
    //   z: this.groups[index+1].position.z,
    //   onUpdate: () => {
    //     // this.camera.lookAt(this.groups[index+1].position)
    //     // this.camera.updateProjectionMatrix()
    //   },
    //   onComplete:() => {
    //     console.log('moved: ', this.groups[index+1].position)
    //   }
    // })
    // .to(this.camera.position, {
    //   x: this.groups[index+2].position.x,
    //   z: this.groups[index+2].position.z,
    //   onUpdate: () => {
    //     // this.camera.lookAt(this.groups[index+2].position)
    //     // this.camera.updateProjectionMatrix()
    //   },
    //   onComplete:() => {
    //     console.log('moved: ', this.groups[3].position)
    //   }
    // })
    // .to(this.camera.position, {
    //   x: this.groups[index+3].position.x,
    //   z: this.groups[index+3].position.z,
    //   onUpdate: () => {
    //     // this.camera.lookAt(this.groups[index+3].position)
    //     // this.camera.updateProjectionMatrix()
    //   },
    //   onComplete:() => {
    //     console.log('moved: ', this.groups[index+3].position)
    //   }
    // })
    // .to(this.camera.position, {
    //   x: this.groups[index+4].position.x,
    //   z: this.groups[index+4].position.z,
    //   onUpdate: () => {
    //     // this.camera.lookAt(this.groups[index+4].position)
    //     // this.camera.updateProjectionMatrix()
    //   },
    //   onComplete:() => {
    //     console.log('moved: ', this.groups[index+4].position)
    //   }
    // })
    // .to(this.camera.position, {
    //   x: this.groups[index+5].position.x,
    //   z: this.groups[index+5].position.z,
    //   onUpdate: () => {
    //     // this.camera.lookAt(this.groups[index+5].position)
    //     // this.camera.updateProjectionMatrix()
    //   },
    //   onComplete:() => {
    //     console.log('moved: ', this.groups[index+5].position)
    //   }
    // })
    // .to("#experience", { opacity: 0 })
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

    this.cameraTargetlook.lookAt(this.lookTarget.position);
    this.cameraTargetlook.rotateOnAxis( new THREE.Vector3(0,1,0), Math.PI * -0.5);
  }
  update = () => {
    // this.updateCameraAlongPath()
  }
}
