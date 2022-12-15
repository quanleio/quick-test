import * as THREE from 'three'
import Experience from './Experience'
import { hexToRgb } from '../utils/utils';

export default class Environment {
  constructor() {
    this.experience = new Experience()
    this.scene = this.experience.scene
    this.resources = this.experience.resources
    this.debug = this.experience.debug

    // debug
    if (this.debug.active) {
      this.debugFolder = this.debug.ui.addFolder('Lights')
    }

    // Wait for resources
    this.resources.on("ready", () => {
      this.setEnv()
    });

    this.setLights()
  }
  setLights = () => {
    /*const lightColors = {
      AmbientColor: '#2900af',
      SpotColor: '#e000ff',
      RectColor: '#0077ff',
    }*/
    const lightColors = {
      AmbientColor: '#ffffff',
      SpotColor: '#372414',
      RectColor: '#341212',
    }

    const ambient = new THREE.AmbientLight(lightColors.AmbientColor, 1)
    this.scene.add(ambient)

    this.debugFolder.addColor(lightColors, 'AmbientColor')
    .onChange(val => ambient.color = hexToRgb(val))

    const spot = new THREE.SpotLight(lightColors.SpotColor, 1, 1000)
    spot.position.set(0, 27, 0)
    spot.castShadow = true
    this.scene.add(spot)

    this.debugFolder.addColor(lightColors, 'SpotColor')
    .onChange(val => spot.color = hexToRgb(val))

    const rectLight = new THREE.RectAreaLight(lightColors.RectColor, 1, 2000, 2000)
    rectLight.position.set(5, 50, 50)
    rectLight.lookAt(0, 0, 0)
    this.scene.add(rectLight)

    this.debugFolder.addColor(lightColors, 'RectColor')
    .onChange(val => rectLight.color = hexToRgb(val))

    /*const point1 = new THREE.PointLight(0xfff000, 1, 1000, 1)
    point1.position.set(0, 10, -100)
    this.scene.add(point1)
    const point2 = new THREE.PointLight(0x00ff00, 1, 1000, 1)
    point2.position.set(20, 5, 20)
    this.scene.add(point2)*/
    const point1 = new THREE.PointLight(0xfff000, 1, 1000, 1)
    point1.position.set(0, 10, -100)
    this.scene.add(point1)
    const point2 = new THREE.PointLight(0x79573e, 1, 1000, 1)
    point2.position.set(100, 10, 0)
    this.scene.add(point2)
    const point3 = new THREE.PointLight(0xc27439, 1, 1000, 1)
    point3.position.set(20, 5, 20)
    this.scene.add(point3)
  }
  setEnv = () => {
    this.scene.background = new THREE.Color(0x645345)
    // this.scene.background = this.resources.items.sceneBackground
  }
  update = () => {}
}
