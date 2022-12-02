import * as THREE from 'three'
import {DRACOLoader} from 'three/examples/jsm/loaders/DRACOLoader'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import Experience from './Experience'

export default class World {
  constructor() {
    this.experience = new Experience()
    this.scene = this.experience.scene
    this.camera = this.experience.camera
    this.controls = this.experience.camera.controls
    this.loader = new GLTFLoader()
    this.butterflies = null

    const dracoLoader = new DRACOLoader()
    dracoLoader.setDecoderPath( 'draco/' )
    this.loader.setDRACOLoader( dracoLoader )

    this.loadModel('models/butterfliesReal.glb', 'Butterflies')
    // this.loadModel('models/Polar_bear1.glb', 'Polarbear')
    // this.loadModel('models/tortoise.glb', 'Tortoise')
    // this.loadModel('models/Tulip.glb', 'Tulip')
  }
  loadModel = (url, name) => {
    this.loader.load(url, gltf => {
      gltf.scene.add( new THREE.AxesHelper())
      gltf.scene.name = name
      this.butterflies = gltf.scene
      this.scene.add( gltf.scene )

      const box = new THREE.BoxHelper( gltf.scene, 0xffff00 );
      this.scene.add( box );

      this.fitCameraToObject(gltf.scene)
    })
  }
  fitCameraToObject = (obj) => {
    this.controls.reset();

    const box = new THREE.Box3().setFromObject(obj);
    const size = box.getSize(new THREE.Vector3()).length();
    const center = box.getCenter(new THREE.Vector3());

    obj.position.x += (obj.position.x - center.x);
    obj.position.y += (obj.position.y - center.y);
    obj.position.z += (obj.position.z - center.z);

    this.camera.instance.near = size / 100;
    this.camera.instance.far = size * 100;
    this.camera.instance.updateProjectionMatrix();

    this.camera.instance.position.copy(center);
    this.camera.instance.position.x += size / 2.0;
    this.camera.instance.position.y += size / 5.0;
    this.camera.instance.position.z += size / 2.0;
    this.camera.instance.lookAt(center);

    this.controls.maxDistance = size * 10;
    this.controls.update();
  }
  rescale = ( obj ) => {
    const bbox = new THREE.Box3().setFromObject( obj );
    const cent = bbox.getCenter(new THREE.Vector3());
    const size = bbox.getSize(new THREE.Vector3());

    // Rescale the object to normalized space
    const maxAxis = Math.max(size.x, size.y, size.z);
    obj.scale.multiplyScalar(1.0 / maxAxis);
    bbox.setFromObject(obj);
    bbox.getCenter(cent);
    bbox.getSize(size);

    //Reposition to 0,halfY,0
    obj.position.copy(cent).multiplyScalar(-1);
    obj.position.y-= (size.y * 0.5);
  }
  fitObjectToCamera = (object) => {
    const size = new THREE.Vector3()
    const center = new THREE.Vector3()
    const box = new THREE.Box3()

    box.makeEmpty()
    box.expandByObject(object)
    box.getSize(size)
    box.getCenter(center )

    const maxSize = Math.max(size.x, size.y, size.z);
    console.log(object.name, maxSize)
    if (maxSize < .1 ) {
      //
    }
    else if (maxSize > 200) {
      console.log(`Model is very large. Scale to 2 meters? ${object.name} ${maxSize}`)
    }
  }
  update = () => {
    // if (this.map) this.map.update()
  }
}
