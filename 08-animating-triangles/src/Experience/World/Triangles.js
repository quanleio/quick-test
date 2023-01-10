import * as THREE from 'three'
import Experience from '../Experience'
// import vertexShader from '../../shaders/triangle.vert'
// import fragmentShader from '../../shaders/triangle.frag'
import { extendMaterial, CustomMaterial } from './ExtendMaterial';
// extendMaterial: https://codepen.io/Fyrestar/pen/YzvmLaO
// https://discourse.threejs.org/t/customdepthmaterial-vertex-shader/45838

export default class Triangles {
  constructor() {
    this.experience = new Experience()
    this.scene = this.experience.scene
    this.resources = this.experience.resources
    this.debug = this.experience.debug

    this.params = {
      progress: 0
    }

    this.addFloor()
    this.setObject()
  }
  addFloor = () => {
    const floor = new THREE.Mesh(
        new THREE.PlaneGeometry(15, 15, 100, 100),
        new THREE.MeshStandardMaterial({
          color: 0xffffff,
          side: THREE.DoubleSide
        })
    )
    floor.rotation.x = -Math.PI*0.5
    floor.position.y = -1.1
    floor.castShadow = false
    floor.receiveShadow = true
    this.scene.add(floor)
  }
  setObject = () => {
    //
    /*this.material = new THREE.ShaderMaterial({
      uniforms:  {
        uTime: { value: 0 },
      },
      vertexShader: vertexShader,
      fragmentShader: fragmentShader,
      side: THREE.DoubleSide,
    })*/

    this.material2 = extendMaterial( THREE.MeshStandardMaterial, {
      class: CustomMaterial,
      vertexHeader: `
        attribute float aRandom;
        uniform float uTime;
        uniform float progress;
      `,
      vertex: {
        transformEnd: `
          transformed += progress*aRandom*(0.5*sin(uTime)+0.5) * normal;
        `
      },
      uniforms: {
        roughness: 0.75,
        uTime: {
          mixed: true,
          linked: true,
          value: 0
        },
        progress: {
          mixed: true,
          linked: true,
          value: 0.5
        }
      }
    });

    //
    // this.geometry = new THREE.IcosahedronGeometry(1, 3)
    this.geometry = new THREE.SphereGeometry(1, 32, 32).toNonIndexed()

    const len = this.geometry.attributes.position.count
    const randoms = new Float32Array(len*3)
    for(let i=0; i<len;i+=3) {
      let r = Math.random()
      randoms[i] = r;
      randoms[i+1] = r;
      randoms[i+2] = r;
    }
    this.geometry.setAttribute('aRandom', new THREE.BufferAttribute(randoms, 1))

    //
    const plane = new THREE.Mesh(this.geometry, this.material2)
    plane.castShadow = plane.receiveShadow = true
    plane.customDepthMaterial = extendMaterial( THREE.MeshDepthMaterial, {
      template: this.material2
    } );
    this.scene.add(plane)

    // debug
    if (this.debug.active) {
      this.debug.ui.add(this.params, "progress", 0, 1, 0.01).onChange(val => {
        this.material2.uniforms.progress.value = val
      });
    }
  }
  update = () => {
    this.material2.uniforms.uTime.value = performance.now() / 1000
  }
}
