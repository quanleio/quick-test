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
    this.points = []
    this.targets = []
    this.params = {
      pathSegments: 512,
      radius: 0.05,
      radiusSegments: 8,
      closed: false,
      scale: 10,
    }
    this.groups = []
    this.geometries = [new Box(), new Torus(), new Cone(), new Cylinder()]

    this.position = new THREE.Vector3()
    this.quaternion = new THREE.Quaternion()
    this.scale = new THREE.Vector3()

    this.makePath()
    this.makeCameraTarget()
    this.animate()
    // window.addEventListener('scroll', this.onScrollHandler, false)
  }
  makePath = () => {
    for (let i = this.count; i >=0; i--) {
      let r = (i * Math.PI * 3) / this.count
      this.points.push(new THREE.Vector3(Math.sin(r)*10, 0, i-95)) // => make sure first point has z=0
    }
    const path = new THREE.CatmullRomCurve3(this.points)
    const geometry = new THREE.TubeGeometry( path, this.params.pathSegments, this.params.radius, this.params.radiusSegments, this.params.closed );
    const material = new THREE.MeshBasicMaterial( { color: 0xfff700, wireframe: true } );
    this.tube = new THREE.Mesh( geometry, material );
    this.scene.add( this.tube );

    // for(let i=0; i<this.points.length; i+=5) {
    for(let i=0; i<this.points.length; i++) {
      const vec = this.points[i]
      this.targets.push(vec)
    }
    console.log('this.points: ', this.points)
  }
  getRandomGeometry = () => {
    return this.geometries[Math.floor(Math.random() * Math.floor(this.geometries.length))];
  }
  getMesh = (geometry, material) => {
    const mesh = new THREE.Mesh(geometry, material)
    mesh.castShadow = mesh.receiveShadow = true

    return mesh
  }
  makeCameraTarget = ()=> {
    // target look
    // this.targetLook = new THREE.Mesh(
    //     new THREE.BoxGeometry(.3, .3, 1),
    //     new THREE.MeshNormalMaterial({ wireframe: true}))
    // this.camera.add(this.targetLook)
    // this.targetLook.position.z = 0
    // this.camera.lookAt(0, 0, 0)
    // this.targetLookBB = new THREE.Box3().setFromObject(this.targetLook)

    // reset controls
    // this.controls.target.copy( new THREE.Vector3(0, 1, -1000) )
    // this.controls.update()

    const geometry1 = new THREE.BoxGeometry( 1, 1, 2 );
    const  material1 = new  THREE.MeshBasicMaterial({
      color:0x333333,
      side:THREE.DoubleSide,
    })
    this.cameraTarget = new THREE.Object3D()
    this.lookTarget = new THREE.Object3D;
    this.cameraTargetlook = new THREE.Mesh(geometry1,material1);
    // this.scene.add(this.cameraTargetlook);

    //
    const material = new THREE.MeshBasicMaterial({
      transparent: true, opacity: 1,
      color: 'red',
      side:THREE.DoubleSide,
    });
    for(let i=0; i<this.targets.length; i++) {
      const vec = this.targets[i]
      const group = new THREE.Object3D()
      group.position.copy(vec)
      this.scene.add(group)
      this.groups.push(group)

      const geo = this.getRandomGeometry()
      const mesh = this.getMesh(geo.geometry, material.clone())
      mesh.name = 'Index_'+i
      mesh.rotation.set(geo.rotationX, geo.rotationY, geo.rotationZ)

      mesh.initialRotation = {
        x: mesh.rotation.x,
        y: mesh.rotation.y,
        z: mesh.rotation.z,
      }
      group.add(mesh)
    }
  }
  animate = () => {
    gsap.registerPlugin(ScrollTrigger)

    // set not render immediately and reset trigger at the first time.
    ScrollTrigger.defaults({ immediateRender: false })
    ScrollTrigger.clearScrollMemory();
    window.history.scrollRestoration = "manual";

    let camera_anim_tl = gsap.timeline({
      scrollTrigger: {
        trigger: ".section-one",
        start: "top top",
        endTrigger: ".section-seven",
        end: "bottom bottom",
        markers: true,
        scrub: 1,
      }
    })

    for(let i=0; i<this.groups.length; i++) {
      let group = this.groups[i]
      camera_anim_tl
      .to(this.camera.position, {
        x: group.position.x,
        y: group.position.y+1,
        z: group.position.z,
        onUpdate: () => {
          // this.controls.target.copy( group.position )
          // this.controls.target.set(this.camera.position.x, this.camera.position.y, this.camera.position.z-0.0001)
          // this.controls.target.set(group.position.x, group.position.y+1, group.position.z)
          // this.controls.update()
        },
        onComplete:() => {
          if (i===6) {
            console.log('onComplete')
            camera_anim_tl.to("#experience", { opacity: 0 }, "simultaneously")
          }
        }
      })
    }
  }
  detectCollisionCubes = (object1, object2) => {
    object1.geometry.computeBoundingBox(); // not needed if its already calculated
    object2.geometry.computeBoundingBox();
    object1.updateMatrixWorld();
    object2.updateMatrixWorld();

    const box1 = object1.geometry.boundingBox.clone();
    box1.applyMatrix4(object1.matrixWorld);

    const box2 = object2.geometry.boundingBox.clone();
    box2.applyMatrix4(object2.matrixWorld);

    return box1.intersectsBox(box2);
  }
  animateGroupMesh = (group) => {
    const mesh = group.children[0]

    gsap.to(mesh.position, {
      duration: 0.7,
      y: 1.0,
      ease: "power3.in"
    })
    gsap.to(mesh.rotation, {
      duration: 1.5,
      x: map(mesh.position.y, -1, 1, radians(45), mesh.initialRotation.x),
      y: map(mesh.position.y, -1, 1, radians(-90), mesh.initialRotation.y),
      z: map(mesh.position.y, -1, 1, radians(90), mesh.initialRotation.z),
      ease: "power3.in"
    })
    // gsap.to(mesh.material, {
    //   duration: 0.2,
    //   opacity: 1,
    //   ease: "power1.inOut",
    // })


  }
  onScrollHandler = () => {
    // this.scrollY = window.scrollY
    // this.camera.position.z = -this.scrollY / this.sizes.height * 5

    // const st = window.pageYOffset || document.documentElement.scrollTop; // Credits: "https://github.com/qeremy/so/blob/master/so.dom.js#L426"
    // if (st > this.lastScrollTop){
    //   console.log('down')
    // } else {
    //   console.log('upscroll')
    // }
    // this.lastScrollTop = st <= 0 ? 0 : st;

    this.updateCameraAlongPath()
  }
  updateCameraAlongPath = () => {
    const time = this.clock.getElapsedTime();
    const looptime = 50; //20
    const t = (time % looptime)/ looptime;
    const t2 = ((time +0.1)% looptime) / looptime;
    const  t3 = ((time +0.101)% looptime) / looptime;

    const pos = this.tube.geometry.parameters.path.getPointAt(t);
    const pos2 = this.tube.geometry.parameters.path.getPointAt(t2);
    const pos3 = this.tube.geometry.parameters.path.getPointAt(t3);
    this.camera.position.set(pos.x, pos.y +1, pos.z);
    this.cameraTarget.position.set(pos2.x, pos2.y +1, pos2.z);
    this.cameraTargetlook.position.set(pos2.x, pos2.y +3, pos2.z);
    this.lookTarget.position.set(pos3.x, pos3.y +3, pos3.z);

    this.camera.lookAt(this.cameraTarget.position);

    // this.cameraTargetlook.lookAt(this.lookTarget.position);
    // this.cameraTargetlook.rotateOnAxis( new THREE.Vector3(0,1,0), Math.PI * -0.5);
  }
  update = () => {
    // this.updateCameraAlongPath()
  }
}
