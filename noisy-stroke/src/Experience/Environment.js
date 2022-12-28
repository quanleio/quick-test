import * as THREE from 'three'
import Experience from './Experience'
import Debug from '../utils/Debug';
import {hexToRgb} from '../../../pick-chocolate/src/utils/utils';

export default class Environment {
  constructor() {
    this.experience = new Experience()
    this.scene = this.experience.scene
    this.resources = this.experience.resources
    this.debug = this.experience.debug

    this.params = {
      ambientColor: 0xFF7F00,
      directionalColor: 0x111111,
      fogColor: 0xeeeeee,
      fogNear: 4.,
      fogFar: 15.
    };

    this.addLights()

    // Wait for resources
    this.resources.on("ready", () => {
      this.setEnv()
    });

  }
  addLights = () => {
    const ambientLight = new THREE.AmbientLight(this.params.ambientColor, 1.);
    this.scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(this.params.directionalColor,  1.5);
    dirLight.position.set(4, 4, 4);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 4096;
    dirLight.shadow.mapSize.height = 4096;
    dirLight.shadow.camera.near = 2;
    dirLight.shadow.camera.far = 15;
    this.scene.add(dirLight);
  }
  setEnv = () => {
    // test
    this.scene.add(new THREE.GridHelper(20, 20, 0x007f7f, 0x007f7f));
    // this.scene.background = this.params.fogColor
    // this.scene.background = this.resources.items.bgTexture

    this.scene.fog = new THREE.Fog(this.params.fogColor, this.params.fogNear, this.params.fogFar);

    if (this.debug.active) {
      this.debugFolder = this.debug.ui.addFolder('Fog')

      this.debugFolder.add(this.params, "fogNear", 6, 12).onChange(val => {
        this.scene.fog.near = val
      })
      this.debugFolder.add(this.params, "fogFar", 12, 20).onChange(val => {
        this.scene.fog.far = val
      });
    }
  }
  update = () => {
    this.experience.update()
  }
}
