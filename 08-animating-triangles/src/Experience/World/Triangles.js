import * as THREE from 'three'
import Experience from '../Experience'
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
      uTime: 0,
      progress: 0
    }

    this.addFloor()
    this.setObject()
  }
  addFloor = () => {
    const floor = new THREE.Mesh(
        new THREE.PlaneGeometry(2000, 2000),
        new THREE.MeshPhongMaterial({
          color: 0xe5e1d6, //0x808080
          side: THREE.DoubleSide,
          transparent: true,
          opacity: 1
        })
    )
    floor.rotation.x = -Math.PI*0.5
    floor.position.y = -0.95
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
        attribute vec3 aCenter;
        uniform float uTime;
        uniform float progress;
        
        mat4 rotationMatrix(vec3 axis, float angle) {
          axis = normalize(axis);
          float s = sin(angle);
          float c = cos(angle);
          float oc = 1.0 - c;
          
          return mat4(oc * axis.x * axis.x + c,           oc * axis.x * axis.y - axis.z * s,  oc * axis.z * axis.x + axis.y * s,  0.0,
                      oc * axis.x * axis.y + axis.z * s,  oc * axis.y * axis.y + c,           oc * axis.y * axis.z - axis.x * s,  0.0,
                      oc * axis.z * axis.x - axis.y * s,  oc * axis.y * axis.z + axis.x * s,  oc * axis.z * axis.z + c,           0.0,
                      0.0,                                0.0,                                0.0,                                1.0);
        }

        vec3 rotate(vec3 v, vec3 axis, float angle) {
          mat4 m = rotationMatrix(axis, angle);
          return (m * vec4(v, 1.0)).xyz;
        }
      `,
      vertex: {
        transformEnd: `
        
          float prog = (position.y + 100.0)/2.0;
          float locprog = clamp((progress - 0.9*prog)/0.1, 0.0, 1.0);
          
          locprog = progress;
        
          transformed = transformed-aCenter; // normalize
          transformed += 600.0*normal*aRandom*(locprog);
          
          transformed *= (1.0 - locprog); // scale
          
          transformed += aCenter; // bring back
          
          transformed = rotate(transformed, vec3(0.0, 1.0, 0.0), aRandom*(locprog)*3.14*4.0); // rotate
        `
      },
      uniforms: {
        roughness: 0.75,
        uTime: {
          mixed: true,
          linked: true,
          value: this.params.uTime
        },
        progress: {
          mixed: true,
          linked: true,
          value: this.params.progress
        }
      }
    });
    this.material2.uniforms.diffuse.value = new THREE.Color(0xe5e1d6)

    //
    // this.geometry = new THREE.IcosahedronGeometry(1, 10).toNonIndexed()
    // this.geometry = new THREE.SphereGeometry(1, 32, 32).toNonIndexed()

    // model
    this.model = this.resources.items.dancer.scene
    this.scene.add(this.model)

    this.model.traverse(child => {
      child.castShadow = true

      if (child.material) {
        child.material = this.material2
        child.customDepthMaterial = extendMaterial( THREE.MeshDepthMaterial, {
          template: this.material2
        });
      }

      if (child.geometry) {
        child.geometry = child.geometry.toNonIndexed()
        let geometry = child.geometry
        // let geometry = child.geometry.toNonIndexed()
        // child.geometry = geometry.toNonIndexed()

        const len = geometry.attributes.position.count

        const randoms = new Float32Array(len*1)
        const centers = new Float32Array(len*3)

        for(let i=0; i<len; i+=3) {
          let r = Math.random()
          randoms[i] = r;
          randoms[i+1] = r;
          randoms[i+2] = r;

          let x = geometry.attributes.position.array[i*3]
          let y = geometry.attributes.position.array[i*3+1]
          let z = geometry.attributes.position.array[i*3+2]

          let x1 = geometry.attributes.position.array[i*3+3]
          let y1 = geometry.attributes.position.array[i*3+4]
          let z1 = geometry.attributes.position.array[i*3+5]

          let x2 = geometry.attributes.position.array[i*3+6]
          let y2 = geometry.attributes.position.array[i*3+7]
          let z2 = geometry.attributes.position.array[i*3+8]

          // get average of those 3 vectors
          let center = new THREE.Vector3(x,y,z).add(new THREE.Vector3(x1,y1,z1)).add(new THREE.Vector3(x2,y2,z2)).divideScalar(3)

          centers.set([center.x, center.y, center.z], i*3)
          centers.set([center.x, center.y, center.z], (i+1)*3)
          centers.set([center.x, center.y, center.z], (i+2)*3)
        }
        geometry.setAttribute('aRandom', new THREE.BufferAttribute(randoms, 1))
        geometry.setAttribute('aCenter', new THREE.BufferAttribute(centers, 3))
      }
    })

    //
    // const plane = new THREE.Mesh(this.geometry, this.material2)
    // plane.castShadow = plane.receiveShadow = true
    // plane.customDepthMaterial = extendMaterial( THREE.MeshDepthMaterial, {
    //   template: this.material2
    // });
    // this.material2.uniforms.diffuse.value = new THREE.Color(0xff0000)
    // this.scene.add(plane)

    // debug
    if (this.debug.active) {
      this.debug.ui.add(this.params, "progress", 0, 1, 0.01).onChange(val => {
        this.material2.uniforms.progress.value = val
      });
    }
  }
  update = () => {
    // this.material2.uniforms.uTime.value = performance.now() / 1000
  }
}
