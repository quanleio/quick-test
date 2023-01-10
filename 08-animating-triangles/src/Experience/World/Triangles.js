import * as THREE from 'three'
import Experience from '../Experience'
import vertexShader from '../../shaders/temp.vert'
import fragmentShader from '../../shaders/temp.frag'
// import { extendMaterial } from './ExtendMaterial.module';
import { ExtendedMaterial } from "three-extended-material"

export default class Triangles {
  constructor() {
    this.experience = new Experience()
    this.scene = this.experience.scene
    this.resources = this.experience.resources
    this.debug = this.experience.debug

    this.setObject()
  }
  setObject = () => {
    //
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

    //
    /*this.material = new THREE.ShaderMaterial({
      uniforms:  {
        uTime: { value: 0 },
      },
      vertexShader: vertexShader,
      fragmentShader: fragmentShader,
      side: THREE.DoubleSide,
    })*/

    const triangleExtension = {
      name: "triangle",
      uniforms:  {
        uTime: { value: 0 },
        progress: { value: 0 },
      },
      vertexShader: (shader) => {
        shader = /*glsl*/ `
        uniform float uTime;
        uniform float progress;
        uniform sampler2D texture;
        
        varying vec2 vUv;
        varying vec2 vPosition;
        
        attribute float aRandom;
      ${shader.replace(
            "#include <project_vertex>",
            /*glsl*/ `
         #include <project_vertex>
        vUv = uv;
        vec3 pos = position;
        pos += progress*aRandom * (0.5*sin(uTime)+0.5) * normal;
        gl_Position = projectionMatrix *  modelViewMatrix * vec4( pos, 1.);
        `
        )}
    `;
        return shader;
      },
      fragmentShader: (shader) => {
        shader = `
        uniform float uTime;
        uniform sampler2D positionTexture;
        uniform vec4 resolution;
        varying vec2 vUv;
        varying vec2 vPosition;
      ${shader.replace(
            "#include <output_fragment>",
            /*glsl*/ `
        gl_FragColor = vec4(vUv, 0.0, 1.0);
        #include <output_fragment>
        `
        )}
    `;
        return shader;
      },
    };
    this.material2 = new ExtendedMaterial(THREE.MeshStandardMaterial,[triangleExtension],
        {
          side: THREE.DoubleSide
        })

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
    // plane.customDepthMaterial = new ExtendedMaterial( THREE.MeshDepthMaterial, {
    //   template: this.material2
    // });
    plane.castShadow = plane.receiveShadow = true

    this.scene.add(plane)

    //
    if (this.debug.active) {
      this.debugFolder = this.debug.ui.addFolder('Triangle')
      const debugObject = {
        'progress': 0.5,
      };
      this.debugFolder.add(debugObject, "progress", 0, 1, 0.01).onChange(val => {
        this.material2.uniforms.progress.value = val
      });
    }
  }
  update = () => {
    this.material2.uniforms.uTime.value = performance.now() / 1000
    // this.material.uniforms.uTime.value = performance.now() / 1000
  }
}
