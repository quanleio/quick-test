import * as THREE from 'three'
import {radians} from '../../../utils/utils'

export default class Torus {
  constructor() {
    this.geometry = new THREE.TorusGeometry(.3, .12, 30, 200)
    this.rotationX = radians(90)
    this.rotationY = 0
    this.rotationZ = 0
  }
}
