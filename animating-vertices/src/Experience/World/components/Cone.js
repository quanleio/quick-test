import * as THREE from 'three'
import {radians} from '../../../utils/utils';

export default class Cone {
  constructor() {
    this.geometry = new THREE.ConeGeometry(.3, .5, 32)
    this.rotationX = 0
    this.rotationY = 0
    this.rotationZ = radians(-180)
  }
}
