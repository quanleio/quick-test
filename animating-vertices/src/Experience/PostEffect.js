import * as THREE from 'three'
import Experience from './Experience';
import {EffectComposer} from 'three/examples/jsm/postprocessing/EffectComposer';
import {RenderPass} from 'three/examples/jsm/postprocessing/RenderPass';
import postVertex from '../shaders/post.vert';
import postFragment from '../shaders/post.frag';
import {ShaderPass} from 'three/examples/jsm/postprocessing/ShaderPass';

export default class PostEffect {
  constructor() {
    this.experience = new Experience()
    this.renderer = this.experience.renderer.instance
    this.scene = this.experience.scene
    this.camera = this.experience.camera.instance

    this.mouse = new THREE.Vector2()

    this.onMouseMove()
    this.setEffect()
  }
  onMouseMove = () => {
    document.addEventListener('mousemove', (e) => {
      this.mouse.x = ( e.clientX / window.innerWidth ) ;
      this.mouse.y = 1. - ( e.clientY/ window.innerHeight );
    })
  }
  setEffect = () => {
    this.composer = new EffectComposer(this.renderer)
    const renderPass = new RenderPass(this.scene, this.camera)
    this.composer.addPass(renderPass)

    // custom shader pass
    const myEffect = {
      uniforms: {
        "tDiffuse": { value: null },
        "uResolution": { value: new THREE.Vector2(1.,window.innerHeight/window.innerWidth) },
        "uMouse": { value: new THREE.Vector2(-10,-10) },
      },
      vertexShader: postVertex,
      fragmentShader: postFragment
    }
    this.customPass = new ShaderPass(myEffect)
    this.customPass.renderToScreen = true
    this.composer.addPass(this.customPass)
  }
  update = () => {
    console.log('aaaa')

    this.customPass.uniforms.uMouse.value = this.mouse
    this.composer.render()
  }
}
